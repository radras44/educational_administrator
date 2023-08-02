import {
    PrimaryGeneratedColumn,
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
    DeleteDateColumn,
} from "typeorm"
import { Rol } from "./rol"

@Entity()
export class Permiso {
    @PrimaryGeneratedColumn({name : "id_permiso"})
    id : number

    @Column({name : "permiso"})
    permiso : string

    //relations
    @ManyToMany(()=>Rol,(rol)=>rol.permisos)
    roles : Rol[]

    //historial
    @CreateDateColumn({name : "create_date"})
    create_date : Date
    @UpdateDateColumn({name : "update_date"})
    update_date : Date
    @DeleteDateColumn({name : "delete_date"})
    delete_date : Date
}