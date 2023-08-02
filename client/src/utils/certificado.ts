import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts"
import { Asignatura, Estudiante, Nota } from "./interfaces/entityInterfaces";
import axios, { AxiosRequestConfig } from "axios";
import { getAllRelated, getOne } from "./axios/reqUtils";
import { sessionHeaders } from "./axios/headers";
pdfMake.vfs = pdfFonts.pdfMake.vfs
export class Certificado {
    headers: AxiosRequestConfig
    asignaturas: Asignatura[]
    constructor(asignaturas: Asignatura[]) {
        this.headers = sessionHeaders()
        this.asignaturas = asignaturas
    }

    sacarPromedio (arr : number[]){
        const suma = arr.reduce((acumulator,current) =>  acumulator + current,0)
        const promedio = suma/arr.length
        return promedio
    }

    async certificadoDeNotas(estudiante: Estudiante) {

        console.log("imprimiendo certificado de notas");
        //obtener notas del estudiante
        const res = await getAllRelated("nota", "usuario", this.headers, estudiante.id);
        if (!res.status) {
            return { status: false, error: res.error };
        }
        const notas: Nota[] = res.result;
        //definir y agregar columnas de la tabla
        const headers = ["Asignatura", "1", "2", "3", "4", "5", "6", "7", "8", "Promedio"];
        const tableContent = [headers];
        //crear filas y su contenido
        for (const asignatura of this.asignaturas) {
            let newRow = Array(10).fill("-")
            newRow[0] = asignatura.asignatura
            //buscar notas de la asignatura
            const evNotas: Nota[] | undefined = notas.filter((nota: Nota) => nota && nota.evaluacion.clase.asignatura.asignatura.toLowerCase() === asignatura.asignatura.toLowerCase());
            if (evNotas.length > 0) {
                //sacar promedio para columna Promedio
                const evNotaVals = evNotas.map(nota => nota.nota)
                const promedio = this.sacarPromedio(evNotaVals)
                newRow[newRow.length - 1]= String(promedio)
                //agregar notas a columna correspondiente
                for (const nota of evNotas as Nota[]) {
                    newRow[nota.evaluacion.numero_de_evaluacion] = String(nota.nota);
                }
            }
            tableContent.push(newRow);
        }
        //definir ancho de las columnas
        let widths = Array(headers.length).fill(20)
        widths[0] = 150
        widths[(widths.length - 1)] = 60
        //crear tabla y agregar su contentido (tableContent)
        console.log(tableContent)
        const table = {
            headerRows: 1,
            widths: widths,
            body: tableContent
        };
        //agregar tabla al pdf
        const docDef = {
            content: [
                {
                    text: [
                        { text: "Nombre: ", bold: true },
                        { text: `${estudiante.nombre}` },
                    ]
                },
                {
                    text: [
                        {text:"Curso: ",bold : true},
                        {text:`${estudiante.curso.curso}`}
                    ]
                },
                {
                    text: [
                        {text: "RUT: ",bold : true},
                        {text : `${estudiante.rut}`}
                    ]
                },
                {
                    table: table
                }
            ]
        }
        //generar pdf y descargar
        const doc = pdfMake.createPdf(docDef)
        doc.download("notas.pdf")
    }
}