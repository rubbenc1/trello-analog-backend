import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './users.model';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserAuthGuard } from 'src/auth/user-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService){}

    @ApiOperation({summary: 'Create user'})
    @ApiResponse({status: 201, type: User})
    @Post()
    create(@Body() userDto: CreateUserDto){
        return this.usersService.createUser(userDto)
    }

    @ApiOperation({summary:'Update user'})
    @ApiResponse({status: 200, type: User})
    @UseGuards(UserAuthGuard)
    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body()updatedUser: UpdateUserDto){
        return this.usersService.updateUser(id, updatedUser);
    }

    @ApiOperation({summary:'Delete user'})
    @ApiResponse({status: 200, type: User})
    @UseGuards(UserAuthGuard)
    @Delete(":id")
    delete(@Param("id", ParseIntPipe) id: number){
        return this.usersService.deleteUser(id)
    }

    @ApiOperation({summary:'Get user'})
    @ApiResponse({status: 200, type: User})
    @UseGuards(UserAuthGuard)
    @Get(":id")
    getUser(@Param("id", ParseIntPipe) id: number){
        return this.usersService.getUser(id)
    }

    @ApiOperation({summary: 'Get users'})
    @ApiResponse({status: 200, type: [User]})
    @Get()
    getAll(){
        return this.usersService.getUsers();
    }
}
