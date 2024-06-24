import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/users.model';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @ApiOperation({summary: 'Login user'})
    @ApiResponse({status: 200, type: User})
    @Post('/login')
    login(@Body() userDto: CreateUserDto){
        return this.authService.login(userDto)
    }

    @ApiOperation({summary: 'Register user'})
    @ApiResponse({status: 201, type: User})
    @Post('/registration')
    registration(@Body() userDto: CreateUserDto){
        return this.authService.registration(userDto)
    }
}
