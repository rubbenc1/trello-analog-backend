import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.model';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}
    async createUser(dto: CreateUserDto){
        const user = this.userRepository.create(dto);
        return await this.userRepository.save(user);
    }
    async updateUser(id: number, dto:UpdateUserDto){
        const result = await this.userRepository.update(id, dto);
        if(result.affected === 0){
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        const updatedUser = this.userRepository.findOneBy({id});
        return updatedUser;
    }
    async deleteUser(id: number){
        const result = await this.userRepository.delete(id);
        if(result.affected === 0){
            throw new NotFoundException(`User with ID ${id} not found`)
        }
    }
    async getUser(id:number){
        const user = await this.userRepository.findOne({where: {id}});
        return user;
    }
    async getUsers(){
        const users =  await this.userRepository.find({relations:['userProjects']});
        return users;
    }
}
