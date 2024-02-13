import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity()
export class Report{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    prize: number;
    
}