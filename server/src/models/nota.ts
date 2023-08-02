import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    DeleteDateColumn
} from "typeorm"
import { Usuario } from "./usuario"
import { Asignatura } from "./asignatura"
import { Estudiante } from "./estudiante"
import { Clase } from "./clase"
import { Evaluacion } from "./evaluacion"

@Index(["estudiante","evaluacion"],{unique:true})
@Entity()
export class Nota {
    @PrimaryGeneratedColumn({name : "id_nota"})
    id : number
    @Column({name : "nota",nullable:true,type:"float"})
    nota : number

    //relaciones
    @ManyToOne(()=>Estudiante,(estudiante)=>estudiante.nota,{nullable : true,onDelete:"CASCADE",cascade:["soft-remove"]})
    @JoinColumn({name : "id_estudiante"})
    estudiante : Estudiante

    @ManyToOne(()=> Evaluacion,(evaluacion)=>evaluacion.nota,{nullable : false})
    @JoinColumn({name : "id_evaluacion"})
    evaluacion : Evaluacion

    //historial
    @CreateDateColumn({name : "create_date"})
    create_date : Date
    @UpdateDateColumn({name : "update_date"})
    update_date : Date
    @DeleteDateColumn({name : "delete_date"})
    delete_date : Date
}