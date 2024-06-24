import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './projects.model';
import { UserProjects } from './user-projects.model';
import { User } from 'src/users/users.model';
import { AuthModule } from 'src/auth/auth.module';
import { TasksColumn } from 'src/tasks-column/tasks-column.model';


@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [
    TypeOrmModule.forFeature([Project, User, UserProjects, TasksColumn]),
    AuthModule
  ]

})
export class ProjectsModule {}
