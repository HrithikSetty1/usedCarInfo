import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';


describe('AuthService', ()=>{
    let service: AuthService;
    let fakeUserService: Partial<UsersService>;

    beforeEach(async()=>{
        const users: User[] = [];
        fakeUserService = {
            find: (email) => {
                const filteredUsers = users.filter(user => user.email===email);
                return Promise.resolve(filteredUsers);
            },
            create: (email:string, password:string) => {
                const user = {id:Math.floor(Math.random()*999999), email, password} as unknown as User;
                users.push(user);
                return Promise.resolve(user);
            }
        };
    
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
            {
                provide: UsersService,
                useValue: fakeUserService,
            },
        ]
        }).compile();
    service = module.get(AuthService);
    }); 



    it('should create an instance of the service file', async()=>{    
        expect(service).toBeDefined();
    });


    it('creates a new user with salted and hashed password', async()=>{
        const user = await service.signup('h@h.com', 'asdf');
        expect(user.password).not.toEqual('asdf');
        const [salt,hash] = user.password.split('.');
        expect(salt).toBeDefined;
        expect(hash).toBeDefined;
    });

    it('throws a BadRequest error when entered email is already in use', async()=>{

        fakeUserService.find = ()=> Promise.resolve([{ id: 1, email: 'a', password: '1' } as unknown as User]);
        await expect(service.signup('h@h.com','asdf')).rejects.toThrow(new BadRequestException("Email in use"));
    });

    it('throws an error if email is not found', async()=>{
        await expect(service.signin('a@a.com', 'asdf')).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequest error when passwords are not matched', async()=>{
        await service.signup('h@h.com','abcd');
        await expect(service.signin('h@h.com', 'asdfg')).rejects.toThrow(BadRequestException);
    });

    it('should return an user when sign-in is successful', async()=>{
        await service.signup('h@h.com','abcd');
        const user = await service.signin('h@h.com','abcd');
        expect(user).toBeDefined;
    });
});