import {
    Entity,
    Column,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    ManyToMany,
    JoinTable,
    DeleteDateColumn
} from "typeorm"
import { Rol } from "./rol"
import { Genero } from "./genero"
import { Curso } from "./curso"
import { Anotacion } from "./anotacion"
import { Nota } from "./nota"
import { Clase } from "./clase"
import { Evaluacion } from "./evaluacion"

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn({name : "id_usuario"})
    id : number
    
    @Column({name : "nombre_de_usuario"})
    nombre_de_usuario : string
    @Column({name : "nombre",nullable:true})
    nombre : string
    @Column({name : "apellido",nullable: true})
    apellido : string
    @Column({name : "rut",nullable:true})
    rut : string
    @Column({name : "email",unique:true})
    email : string

    //relations
    @ManyToOne(()=>Genero,(genero)=>genero.usuario,{nullable:true})
    @JoinColumn({name : "id_genero"})
    genero : Genero
    @ManyToOne(()=>Rol,(rol)=>rol.usuario,{nullable : true,onDelete:"SET NULL"})
    @JoinColumn({name : "id_rol"})
    rol : Rol
    @ManyToOne(()=> Curso,(curso)=> curso.usuario,{nullable:true})
    @JoinColumn({name : "id_curso"})
    curso : Curso
    @ManyToMany(()=>Clase,(clase) => clase.usuarios)
    @JoinTable({name : "usuario_clase"})
    clases : Clase[] 
    
    @OneToMany(()=> Anotacion,(anotacion)=> anotacion.usuario)
    anotacion : Anotacion
    @OneToMany(()=>Evaluacion,(evaluacion)=>evaluacion.usuario)
    evaluacion : Evaluacion


    //historial
    @CreateDateColumn({name : "create_date"})
    create_date : Date
    @UpdateDateColumn({name : "update_date"})
    update_date : Date
    @DeleteDateColumn({name : "delete_date"})
    delete_date : Date
}