import {
    Expose,
    Transform
} from 'class-transformer';

export class ReportDto{

    @Expose()
    id:number;

    @Expose()
    price:number;

    @Expose()
    year:number;

    @Expose()
    long: number;

    @Expose()
    lat:number;

    @Expose()
    make: string;

    @Expose()
    model:string;

    @Expose()
    mileage: number;

    @Expose()
    approved: boolean;

    @Expose()
    @Transform(({obj})=>obj.user.id)
    userId: number;
}