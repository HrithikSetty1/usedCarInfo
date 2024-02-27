import {
    ExecutionContext,
    CanActivate
} from '@nestjs/common';
import { Observable } from 'rxjs';


export class AdminGaurd implements CanActivate{

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        if(!request.currentUser){
            return false;
        }
        return request.currentUser.isAdmin;
    }
}
