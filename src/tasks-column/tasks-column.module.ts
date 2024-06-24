import { Module } from '@nestjs/common';
import { TasksColumnController } from './tasks-column.controller';
import { TasksColumnService } from './tasks-column.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksColumn } from './tasks-column.model';
import { Project } from 'src/projects/projects.model';
import { TasksColumnOptions } from 'src/tasks-column-options/tasks-column-options.model';
import { AuthModule } from 'src/auth/auth.module';
import { UserProjects } from 'src/projects/user-projects.model';

@Module({
  controllers: [TasksColumnController],
  providers: [TasksColumnService],
  imports: [
    TypeOrmModule.forFeature([TasksColumn, Project, TasksColumnOptions, UserProjects]),
    AuthModule
  ]
})
export class TasksColumnModule {}
