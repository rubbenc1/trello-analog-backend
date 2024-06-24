import { Module } from '@nestjs/common';
import { TasksValuesController } from './tasks-values.controller';
import { TasksValuesService } from './tasks-values.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksValues } from './tasks-values.model';
import { Tasks } from 'src/tasks/tasks.model';
import { TasksColumn } from 'src/tasks-column/tasks-column.model';
import { TasksColumnOptions } from 'src/tasks-column-options/tasks-column-options.model';
import { AuthModule } from 'src/auth/auth.module';
import { UserProjects } from 'src/projects/user-projects.model';

@Module({
  controllers: [TasksValuesController],
  providers: [TasksValuesService],
  imports: [
    TypeOrmModule.forFeature([TasksValues, Tasks, TasksColumn, TasksColumnOptions, UserProjects]),
    AuthModule
  ], 
  exports: [TasksValuesService]
})
export class TasksValuesModule {}
