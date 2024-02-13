import {
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../users.service';

@Injectable()
class CurrentUserInterceptor implements NestInterceptor{

    constructor(private userService:UsersService){};

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        
        const request = context.switchToHttp().getRequest();
        const { userId } = request.session || {};

        if(userId){
            const user = this.userService.findOne(userId);
            console.log("*******************"+user);
            request.currentUser = user;
        }

        return next.handle();
    }
}