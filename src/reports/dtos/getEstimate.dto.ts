import { IsString, 
    IsNumber, 
    Min, 
    Max, 
    IsLongitude, 
    IsLatitude  } from "class-validator";

export class GetEstimteDto {

    @IsString()
    make: string;

    @IsString()
    model: string;

    @IsNumber()
    @Min(1930)
    @Max(2050)
    year:number;

    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage: number;

    @IsLongitude()
    long: number;

    @IsLatitude()
    lat: number;
}