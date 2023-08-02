import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from "typeorm"
import { Usuario } from "./usuario"

@Entity()
export class Genero {
    @PrimaryGeneratedColumn({name : "id_genero"})
    id : number

    @Column({name : "genero",type:"varchar"})
    genero : string

    //relations
    @OneToMany(()=>Usuario,(usuario)=>usuario.genero)
    usuario : Usuario

    //historial
    @CreateDateColumn({name : "create_date"})
    create_date : Date
    @UpdateDateColumn({name : "update_date"})
    update_date : Date
    @DeleteDateColumn({name : "delete_date"})
    delete_date : Date
}