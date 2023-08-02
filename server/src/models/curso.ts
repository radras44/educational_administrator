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
import { Clase } from "./clase"

@Entity()
export class Curso {
    @PrimaryGeneratedColumn({name : "id_curso"})
    id : number

    @Column({name : "curso"})
    curso : string
    @Column({name : "letra",type:"char",length:1})
    letra : string

    //relations
    @OneToMany(()=>Clase,(clase)=>clase.curso)
    clase : Clase
    @OneToMany(()=> Usuario,(usuario)=>usuario.curso)
    usuario:Usuario

    //historial
    @CreateDateColumn({name : "create_date"})
    create_date : Date
    @UpdateDateColumn({name : "update_date"})
    update_date : Date
    @DeleteDateColumn({name : "delete_date"})
    delete_date : Date
}