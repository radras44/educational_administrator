import axios, { AxiosRequestConfig } from "axios"
import * as XLSX from "xlsx"

import { sessionHeaders } from "./axios/headers"
import { StaticEntitiesType } from "./interfaces/interfaces"
import { generateErrorMsg } from "./axios/reqUtils"

interface DBEstudiante {
  nombre_de_usuario: string
  nombre: string
  apellido: string
  rut: string
  curso: number
  genero: number | null
  direccion: string | null
  comuna_de_residencia: string | null
  telefono: string
  fecha_de_nacimiento: Date | null
}

export interface SynchronizedDataType {
  toCreate: DBEstudiante[]
  toUpdate: DBEstudiante[]
  toDelete: DBEstudiante[]
}

export class Synchronizer {
  public currentEstudiantes: any[];
  public staticEntities: StaticEntitiesType
  public synchronizedData: SynchronizedDataType | null
  public headers: AxiosRequestConfig;

  constructor(currentEstudiantes: any[], staticEntities: StaticEntitiesType) {
    console.log("synchronizer inicializado")
    this.synchronizedData = null
    this.headers = sessionHeaders();
    this.currentEstudiantes = currentEstudiantes
    this.staticEntities = staticEntities
  }

  //leer excel y devolver json con array con objetos de cada fila 
  async read(file: File, headerRow: number): Promise<any> {
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          const data = new Uint8Array(reader.result as ArrayBuffer);
          const excelBook = XLSX.read(data, { type: 'array' });
          const sheetName = excelBook.SheetNames[0];
          const sheet = excelBook.Sheets[sheetName];
          const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { header: headerRow });
          const jsonDataHeaders = Object.keys(jsonData[0])
          console.log("headers:",jsonDataHeaders)
          console.log("jsonData =", jsonData)
          if (!jsonDataHeaders.includes("Run")) {
            resolve({
              status: false,
              error: "hubo un problema con los nombres de las columnas, asegurese de que estos se encuentren en la primera fila del documento"
            })
          } else {
            resolve({
              status: true,
              result: jsonData
            });
          }
        };

        reader.onerror = () => {
          reject({
            status: false,
            error: "Error al leer el archivo",
          });
        };

        reader.readAsArrayBuffer(file);
      });
    } else {
      return {
        status: false,
        error: "Formato de archivo no válido",
      };
    }
  }

  //convertir numero entregado por excel a una fecha (el numero entregado por excel suele estar en dias)
  numberToDate(value: number) {
    if (value && typeof value === "number") {
      const dateObj = XLSX.SSF.parse_date_code(value)
      const date = new Date(dateObj["y"], dateObj["m"], dateObj["d"])
      return date
    } else {
      return null;
    }
  }

  format(jsonData: any[]) {
    function removeAccents(name: string): string {
      return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    try {
      const preprocessedData = jsonData.map(estudiante => {
        let nombre_de_usuario = `${estudiante["Nombres"]} ${estudiante["Apellido Paterno"]} ${estudiante["Apellido Materno"]}`
        let rut = `${estudiante["Run"]}-${estudiante["Dígito Ver."]}`
        let curso = this.staticEntities.cursos?.find(curso => curso.letra === estudiante["Letra Curso"] && curso.curso[0] === estudiante["Desc Grado"][0]).id || null
        let genero = this.staticEntities.generos?.find(genero => genero.genero[0].toLowerCase() === estudiante["Genero"][0].toLowerCase()).id || null
        const newElement: DBEstudiante = {
          nombre_de_usuario: nombre_de_usuario,
          rut: rut,
          nombre: removeAccents(estudiante["Nombres"]),
          apellido: removeAccents(`${estudiante["Apellido Paterno"]} ${estudiante["Apellido Materno"]}`),
          curso: curso,
          genero: genero,
          direccion: estudiante["Dirección"] || null,
          comuna_de_residencia: estudiante["Comuna Residencia"] || null,
          telefono: estudiante["Telefono"] || null,
          fecha_de_nacimiento: this.numberToDate(estudiante["Fecha Nacimiento"])
        }
        return newElement
      })

      return {
        status : true,
        result : preprocessedData
      }
    } catch (error) {
      return {
        status : false,
        error : "ha ocurrido un problema al modificar el formato de los datos"
      }
    }
  }

  hasDuplicated(array: string[]): boolean {
    const conjunto = new Set<string>();

    for (const elemento of array) {
      if (conjunto.has(elemento)) {
        return true;
      }
      conjunto.add(elemento);
    }
    return false;
  }

  synchronize(preprocessedData: any[]) {
    console.log("preprocessed Data",preprocessedData)
    if (!preprocessedData) {
      return {
        status: false,
        error: "no hay se ha cargado un archivo, o no se han formateado correctamente los datos"
      }
    }
    console.log("in synchronize jsonData = ", preprocessedData)

    const DBruts: string[] = this.currentEstudiantes.map(estudiante => estudiante.rut)
    const importedRuts: string[] = preprocessedData.map(estudiante => estudiante.rut)
    if (this.hasDuplicated(importedRuts)) {
      console.log("tiene datos duplicados")
      return {
        status: false,
        error: "la informacion cargada tiene duplicados en la columna Run + Codigo Ver. (Rut luego del formateo)"
      }
    } else {
      console.log("no hay duplicados")
    }

    //encontrar usuarios que deben agregarse y actualizarse
    let toCreate: DBEstudiante[] = []
    let toUpdate: DBEstudiante[] = []
    let toDelete: DBEstudiante[] = []
    for (const estudiante of preprocessedData) {
      if (DBruts.includes(estudiante.rut)) {
        toUpdate.push(estudiante)
      } else {
        toCreate.push(estudiante)
      }
    }

    //encontrar estudaintes que deben eliminarse de la base de datos
    for (const estudiante of this.currentEstudiantes) {
      if (!importedRuts.includes(estudiante.rut)) {
        toDelete.push(estudiante)
      }
    }

    console.log({ toCreate, toUpdate, toDelete })
    this.synchronizedData = {
      toCreate: toCreate,
      toUpdate: toUpdate,
      toDelete: toDelete
    }

    return {
      status: true,
    }
  }

  async send(actions : string[]) {
    if(!this.synchronizedData){
      return {
        status : false,
        error: generateErrorMsg("la sincronizacion fallo o no se ha podido encontrar\nintentelo de nuevo")
      }
    }
    if(!actions.includes("toCreate")){this.synchronizedData.toCreate = []}
    if(!actions.includes("toUpdate")){this.synchronizedData.toUpdate = []}
    if(!actions.includes("toDelete")){this.synchronizedData.toDelete = []}
    const api_url = `${process.env.NEXT_PUBLIC_API_URL}`
    try {
      const res = await axios.post(`${api_url}/estudiante/synchronize`, this.synchronizedData, this.headers)
      return {
        status: true,
        message: res.data.message
      }
    } catch (error) {
      console.log(error)
      return {
        status: false,
        error: error
      }
    }
  }
}