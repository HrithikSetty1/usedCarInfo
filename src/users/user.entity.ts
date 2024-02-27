import { AfterRemove, AfterInsert, Entity, Column, PrimaryGeneratedColumn, AfterUpdate, OneToMany } from "typeorm";
import { Report } from '../reports/report.entity';
@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    email: String

    @Column()
    password: String

    @Column({default: false})
    isAdmin: boolean;

    @OneToMany(()=> Report, (report)=>report.user)
    reports: Report[];

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