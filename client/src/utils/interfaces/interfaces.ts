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
    icon: JSX.Element,
    color? : "green" | "blue" | "red" | "purple" | "orange"
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




