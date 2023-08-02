import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from "typeorm"
import { Usuario } from "./usuario"
import { Permiso } from "./permiso"

@Entity()
export class Rol {
    @PrimaryGeneratedColumn({name : "id_rol"})
    id : number
    @Column({name : "rol"})
    rol : string
    @Column({name : "nivel",default : 0})
    nivel : number
    
    //relations
    @OneToMany(()=> Usuario,(usuario) => usuario.rol)
    usuario : Usuario
    @ManyToMany(()=> Permiso,(permiso)=>permiso.roles)
    @JoinTable({name : "rol_permiso"})
    permisos : Permiso[] 

    //historial
    @CreateDateColumn({name : "create_date"})
    create_date : Date
    @UpdateDateColumn({name : "update_date"})
    update_date : Date
    @DeleteDateColumn({name : "delete_date"})
    delete_date : Date
}