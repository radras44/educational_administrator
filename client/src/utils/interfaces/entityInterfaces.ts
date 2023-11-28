export interface Clase {
    id: number;
    clase : string;
    electivo: boolean;
    asignatura: Asignatura;
    curso: Curso;
    create_date: Date;
    update_date: Date;
}

export interface SelectedClase extends Omit<Clase, "asignatura" | "curso"> {
    asignatura: number | null,
    curso: number | null
}


export interface Usuario {
    id: number;
    nombre_de_usuario: string;
    nombre?: string;
    apellido?: string;
    rut?: string;
    email: string;
    genero?: Genero;
    rol?: Rol;
    curso?: Curso;
    clases: Clase[];
    anotacion: any[];
    evaluacion: any[];
    create_date: Date;
    update_date: Date;
}

export interface SelectedUsuario extends Omit<Usuario,"genero" | "curso" | "rol" | "clases">{
    curso : number | null
    genero : number | null
    rol : number | null
    clases : number[] 
}

export interface Estudiante {
    id : number
    nombre_de_usuario : string
    rut : string
    nombre : string
    apellido : string
    email : string
    direccion : string
    comuna_de_residencia : string
    telefono : string
    fecha_de_nacimiento : Date
    genero : Genero
    rol : Rol
    curso : Curso
    create_date: Date;
    update_date: Date;
}

export interface SelectedEstudiante extends Omit<Estudiante,"rol"|"curso"|"genero"> {
    rol : number | null
    genero : number | null
    curso : number | null
}

export interface Evaluacion {
    id : number
    evaluacion : string
    numero_de_evaluacion : number
    clase : Clase
    usuario : Usuario
    create_date: Date;
    update_date: Date;
}

export interface SelectedEvaluacion extends Omit<Evaluacion, "usuario" | "clase"> {
    usuario: number | null
    clase: number | null
}

export interface Genero {
    id : number
    genero : string
    usuario : Usuario
    create_date : Date
    update_date : Date
}

export interface Asignatura {
    id : number
    asignatura :string
    clase : Clase
    create_date : Date
    update_date : Date
}

export interface Nota {
    id : number
    nota : number
    estudiante : Estudiante
    evaluacion : Evaluacion
    create_date : Date
    update_date : Date
}

export interface Permiso {
    id : number
    permiso : string
    roles : Rol
    create_date : Date
    update_date : Date
}

export interface Rol {
    id : number
    rol : string
    nivel : number
    usuario : Usuario
    permisos : Permiso[]
    create_date : Date
    update_date : Date
}

export interface SelectedRol extends Rol {
    permisosIdx: number[]
}

export interface Anotacion {
    id : number
    anotacion : string
    estudiante : Estudiante
    usuario : Usuario
    create_date : Date
    update_date : Date
}

export interface Curso {
    id : number
    curso : string
    letra: string
    clase : Clase 
    usuario : Usuario
    create_date : Date
    update_date : Date
}
