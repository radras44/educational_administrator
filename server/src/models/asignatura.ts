import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from "typeorm"
import { Clase } from "./clase"

@Entity()
export class Asignatura {
    @PrimaryGeneratedColumn({name : "id_asignatura"})
    id : number
    @Column({name : "asignatura"})
    asignatura : string

    //relations
    @OneToMany(()=>Clase,(clase) => clase.asignatura)
    clase : Clase

    //historial
    @CreateDateColumn({name : "create_date"})
    create_date : Date
    @UpdateDateColumn({name : "update_date"})
    update_date : Date
    @DeleteDateColumn({name : "delete_date"})
    delete_date : Date
}