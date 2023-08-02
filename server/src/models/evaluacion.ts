import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Clase } from "./clase";
import { Usuario } from "./usuario";
import { Nota } from "./nota";

@Entity()
export class Evaluacion {
    @PrimaryGeneratedColumn({name : "id_evaluacion"})
    id : number

    @Column({name : "evaluacion"})
    evaluacion : string

    @Column({name : "numero_de_evaluacion",nullable:true})
    numero_de_evaluacion : number

    @ManyToOne(()=>Clase,(clase)=>clase.evaluacion)
    @JoinColumn({name : "id_clase"})
    clase: Clase

    @ManyToOne(()=>Usuario,(usuario)=>usuario.evaluacion)
    usuario : Usuario
    @OneToMany(()=>Nota,(nota) => nota.evaluacion)
    nota : Nota

    //historial
    @CreateDateColumn({name : "create_date"})
    create_date : Date
    @UpdateDateColumn({name : "update_date"})
    update_date : Date
    @DeleteDateColumn({name : "delete_date"})
    delete_date : Date
}