import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    DeleteDateColumn
} from "typeorm"
import { Usuario } from "./usuario"
import { Estudiante } from "./estudiante"

@Entity()
export class Anotacion {
    @PrimaryGeneratedColumn({name : "id_anotacion"})
    id : number
    @Column({name : "anotacion"})
    anotacion : string

    //relations
    @ManyToOne(()=> Estudiante,(estudiante)=> estudiante.anotacion)
    @JoinColumn({name : "id_estudiante"})
    estudiante : Estudiante
    
    @ManyToMany(()=> Usuario,(usuario)=>usuario.anotacion)
    @JoinColumn({name : "id_usuario"})
    usuario : Usuario
    //historial
    @CreateDateColumn({name : "create_date"})
    create_date : Date
    @UpdateDateColumn({name : "update_date"})
    update_date : Date
    @DeleteDateColumn({name : "delete_date"})
    delete_date : Date
}