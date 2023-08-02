import {
    Entity,
    Column,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    DeleteDateColumn
} from "typeorm"
import { Rol } from "./rol"
import { Genero } from "./genero"
import { Curso } from "./curso"
import { Anotacion } from "./anotacion"
import { Nota } from "./nota"

@Entity()
export class Estudiante {
    @PrimaryGeneratedColumn({name : "id_estudiante"})
    id : number

    @Column({name : "nombre_de_usuario"})
    nombre_de_usuario : string
    @Column({name : "rut",unique:true})
    rut : string
    @Column({name : "nombre",nullable:true})
    nombre : string
    @Column({name : "apellido",nullable: true})
    apellido : string
    @Column({name : "email",nullable:true,unique:true})
    email : string
    @Column({name:"direccion",nullable:true})
    direccion : string
    @Column({name:"comuna_de_residencia",nullable:true})
    comuna_de_residencia : string
    @Column({name : "telefono",nullable:true})
    telefono : string
    @Column({name : "fecha_de_nacimiento",nullable:true})
    fecha_de_nacimiento : Date


    //relations
    @ManyToOne(()=>Genero,(genero)=>genero.usuario,{nullable:true})
    @JoinColumn({name : "id_genero"})
    genero : Genero
    @ManyToOne(()=>Rol,(rol)=>rol.usuario,{nullable : true})
    @JoinColumn({name : "id_rol"})
    rol : Rol | number = 1
    @ManyToOne(()=> Curso,(curso)=> curso.usuario)
    @JoinColumn({name : "id_curso"})
    curso : Curso
    
    @OneToMany(()=>Anotacion,(anotacion)=>anotacion.estudiante)
    anotacion : Anotacion
    @OneToMany(()=>Nota,(nota)=>nota.estudiante)
    nota : Nota
    
    //historial
    @CreateDateColumn({name : "create_date"})
    create_date : Date
    @UpdateDateColumn({name : "update_date"})
    update_date : Date
    @DeleteDateColumn({name : "delete_date"})
    delete_date : Date
}