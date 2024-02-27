import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseInterceptors,UseGuards, BadRequestException, HttpException} from '@nestjs/common';
import { CreateUser } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { Session } from '@nestjs/common';
import { currentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../gaurds/auth.gaurd';
import { AdminReqDto } from './dtos/adminReq.dto';


@Controller('auth')
@serialize(UserDto)
export class UsersController {

    constructor(private usersService: UsersService, private authService:AuthService){}

    @Post('/signup')
    async createUser(@Body() body: CreateUser, @Session() session?:any){    
        const user = await this.authService.signup(body.email,body.password);
        if(session){
            session.userId = user.id;
        }
        return user;
    }

    @Get('whoamI')
    @UseGuards(AuthGuard)
    async getCurrentUserId(@Session() session:any){
        return this.usersService.findOne(session.userId);
    }

    @Get('currentUser')
    async getCurrentUser(@currentUser() user:User){
        return user;
    }

    @Post('/signout')
    signOut(@Session() session:any){
        session.userId = null;
    }

    @Get('/:id')
    async findUser(@Param('id') id: string){
        const user = await this.usersService.findOne(parseInt(id));
        if(!user){
            throw new NotFoundException("User Not found");
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string){
        return this.usersService.find(email);
    }

    @Delete('/:id')
    deleteUsers(@Param('id') id: string){
        return this.usersService.remove(parseInt(id));
    }

    // @Patch('/:id')
    // updateUser(@Param('id') id:string, @Body() body:UpdateUserDto){
    //     return this.usersService.update(parseInt(id),body);
    // }

    @Post('signin')
    async signin (@Body() body: CreateUser, @Session() session:any){
        const user = await this.authService.signin(body.email,body.password);
        session.userId = user.id;
        return user;
    }

    @Patch('/:id')
    async makeAdmin(@Param('id') id:string, @Body() body:AdminReqDto){
        return this.authService.makeAdmin(id,body);
    }
}
