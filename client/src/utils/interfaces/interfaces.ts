import { Clase, Evaluacion, Usuario } from "./entityInterfaces";

export interface AttributesType {
    label: string
    inputType: "textField" | "select"
    options: any[]
    required?: boolean
}

export interface StaticEntitiesType {
    roles?: any[];
    cursos?: any[];
    generos?: any[];
    asignaturas : any[]
}

export interface ToggleSection {
    label: string
    component: JSX.Element
    requiredPerm: string[],
    icon: JSX.Element
}

export interface SelectedClase extends Omit<Clase, "asignatura" | "curso"> {
    asignatura: number,
    curso: number
}

export interface SelectedEstudiante {
    id: number
    nombre_de_usuario: string
    nombre: string | null
    apellido: string | null
    rut: string | null
    curso: number
    genero: number
    [key: string]: any
}

export interface SelectedRol {
    id: number
    permisosIdx: number[]
    rol: string
    nivel: number
    [key: string]: any
}


export interface SelectedUsuario extends Omit<Usuario, "rol" | "curso" | "genero" | "clases"> {
    rol: number,
    curso: number,
    genero: number
    clases: number[]
}

export interface SelectedEvaluacion extends Omit<Evaluacion, "usuario" | "clase"> {
    usuario: number
    clase: number
}

export interface Filters {
    cursos: number[]
    order: string
    genero: string | null
}

export interface Order {
    name: "A-Z Nombre"|"Z-A Nombre"|"fecha de nacimiento",
    action: (data: any[]) => any[]
}




