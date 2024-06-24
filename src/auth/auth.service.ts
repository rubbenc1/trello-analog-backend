import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/users.model';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>, 
        private jwtService: JwtService,
        private usersService: UsersService
    ){}
    async login(userDto: CreateUserDto){
        const user = await this.validateUser(userDto);
        return this.generateToken(user)
    }
    async registration(userDto: CreateUserDto){
        const {email, password} = userDto
        const candidate = await this.userRepository.findOneBy({email});
        if(candidate){
            throw new HttpException('The user with such mail already exists', HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const newUser = {...userDto, password:hashPassword};
        const user = await this.usersService.createUser(newUser);
        return this.generateToken(user);
    }
    private async generateToken(user: User){
        const payload = {email: user.email, id: user.id, username:user.username}
        return {
            token: this.jwtService.sign(payload)
        }
    }
    private async validateUser(userDto: CreateUserDto){
        const {email, password } = userDto;
        const user = await this.userRepository.findOneBy({email});
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(user && passwordMatch){
            return user
        }else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

}
