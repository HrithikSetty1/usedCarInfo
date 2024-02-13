import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt} from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {

    constructor(private userService:UsersService){}

    async signup(email:string, password:string){
        //See if email already exists
        const users = await this.userService.find(email);

        if(users.length){
            throw new BadRequestException("Email in use");
        }

        //Encrypt
        // gen a salt
        const salt = randomBytes(8).toString('hex');
        //hash the password and salt together
        const hash = (await scrypt(password,salt,32)) as Buffer;
        //join the hash and salt with a saperator
        const result = salt + '.' + hash.toString('hex');
        //Save
        const user = await this.userService.create(email,result);
        //return cookie
        return user;
    }

    async signin(email:string, password:string){
        const [user] = await this.userService.find(email);

        if(!user){
            throw new NotFoundException("Email doesn't exist");
        }

        // saperate the salt from the stored password
        const [salt,storedHash] = user.password.split('.');


        // use the salt and input password to generate hash 
        const hash = (await scrypt(password,salt,32)) as Buffer;


        //compare the stored hash and newly generated hash
        //if not equal throw an exception else return user
        if(hash.toString('hex')!=storedHash){
            throw new BadRequestException("Wrong password");
        }

        return user;
    }
}