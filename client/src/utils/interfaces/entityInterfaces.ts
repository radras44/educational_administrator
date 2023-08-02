export interface Clase {
    id: number;
    clase : string;
    electivo: boolean;
    asignatura: any;
    curso: any;
    create_date: Date;
    update_date: Date;
}

export interface Usuario {
    id: number;
    nombre_de_usuario: string;
    nombre?: string;
    apellido?: string;
    rut?: string;
    email: string;
    genero?: any;
    rol?: any;
    curso?: any;
    clases: any[];
    anotacion: any[];
    evaluacion: any[];
    create_date: Date;
    update_date: Date;
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

export interface Evaluacion {
    id : number
    evaluacion : string
    numero_de_evaluacion : number
    clase : Clase
    usuario : Usuario
    create_date: Date;
    update_date: Date;
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
