import { IsBoolean } from "class-validator";


export class ApproveBodyDto{

    @IsBoolean()
    approved:boolean;
}