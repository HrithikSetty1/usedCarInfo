import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUser } from './dtos/create-user.dto';
import { BadRequestException, HttpException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {

    fakeAuthService = {
      signup: jest.fn(),
      signin: jest.fn()
    }

    fakeUsersService = {
      findOne: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
      update: jest.fn(),
      create: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService
        },
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create user', async()=>{
    
    jest.spyOn(fakeAuthService,'signup').mockImplementation((email, password)=>{
      return Promise.resolve({id:1, email, password} as unknown as User);
    });

    const user = await controller.createUser({email:'h@h.com', password:'abcdef'} as CreateUser);
    console.log(user);
    expect(user).toBeDefined();
    expect(user).toEqual({id:1, email:'h@h.com', password:'abcdef'});

  });

  it('should throw an exception if email entered is already in use', async()=>{
    jest.spyOn(fakeUsersService,'find').mockResolvedValue([{id:1, email:'h@h.com', password:'abcded'} as unknown as User]);
    const user = await controller.createUser({email:'h@h.com', password:'abcdef'} as CreateUser);
    expect(user).not.toBeDefined();
  });
});
