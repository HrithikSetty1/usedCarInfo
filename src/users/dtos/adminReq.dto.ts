import { IsBoolean } from "class-validator";

export class AdminReqDto{

    @IsBoolean()
    isAdmin: boolean;
}