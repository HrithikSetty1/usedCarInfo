import { AfterRemove, AfterInsert, Entity, Column, PrimaryGeneratedColumn, AfterUpdate } from "typeorm"
@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    email: String

    @Column()
    password: String

    @AfterInsert()
    logInsert(){
        console.log("Inserted User with Id: "+this.id);
    }

    @AfterRemove()
    logRemove(){
        console.log("Removed User with id: "+this.id);
    }

    @AfterUpdate()
    logUpdate(){
        console.log("Updated User with id: "+this.id);
    }
    
}