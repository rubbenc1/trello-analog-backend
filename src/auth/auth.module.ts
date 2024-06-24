import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/users/users.model';
import { JwtAuthGuard } from './jwt-auth.gurad';
import { OwnerGuard } from './owner.guard';
import { UserProjects } from 'src/projects/user-projects.model';
import { UserAuthGuard } from './user-auth.guard';
import { Lists } from 'src/lists/lists.model';
import { ColumnOwnerGuard } from './column-owner.guard';
import { TasksColumn } from 'src/tasks-column/tasks-column.model';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, OwnerGuard, UserAuthGuard, ColumnOwnerGuard],
  imports: [
    TypeOrmModule.forFeature([User, UserProjects, TasksColumn]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'Bosno',
      signOptions: {
        expiresIn: '24h',
      }
    }),
    forwardRef(()=>UsersModule)
  ],
  exports: [AuthService, JwtAuthGuard, JwtModule, OwnerGuard, UserAuthGuard, ColumnOwnerGuard]
})
export class AuthModule {}
