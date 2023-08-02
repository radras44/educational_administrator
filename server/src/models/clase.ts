import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Asignatura } from "./asignatura";
import { Usuario } from "./usuario";
import { Curso } from "./curso";
import { Evaluacion } from "./evaluacion";
import { Nota } from "./nota";

@Index(["electivo","asignatura","curso"],{unique : true})
@Entity()
export class Clase {
    @PrimaryGeneratedColumn({name : "id_clase"})
    id : number

    @Column({name : "electivo",nullable:false})
    electivo : boolean
    @Column({name : "clase",nullable:false})
    clase : string

    //relation
    @ManyToOne(()=>Asignatura,(asignatura) => asignatura.clase)
    @JoinColumn({name : "id_asignatura"})
    asignatura : Asignatura

    @ManyToOne(()=>Curso,(curso) => curso.clase)
    @JoinColumn({name : "id_curso"})
    curso : Curso

    @ManyToMany(()=>Usuario,(usuario)=>usuario.clases)
    usuarios : Usuario[]
    @OneToMany(()=>Evaluacion,(evaluacion)=>evaluacion.clase)
    evaluacion : Evaluacion

    //historial
    @CreateDateColumn({name : "create_date"})
    create_date : Date
    @UpdateDateColumn({name : "update_date"})
    update_date : Date
    @DeleteDateColumn({name : "delete_date"})
    delete_date : Date
}