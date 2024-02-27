import { User } from "src/users/user.entity";
import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Report{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({default:false})
    approved: boolean;

    @Column()
    price: number;
    
    @Column()
    make:string;

    @Column()
    model: string;

    @Column()
    year: number;

    @Column()
    mileage: number;

    @Column()
    lat: number;

    @Column()
    long: number;

    @ManyToOne(()=>User, (user)=>user.reports)
    user: User;  
}