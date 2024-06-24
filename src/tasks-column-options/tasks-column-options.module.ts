import { Module } from '@nestjs/common';
import { TasksColumnOptionsController } from './tasks-column-options.controller';
import { TasksColumnOptionsService } from './tasks-column-options.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksColumn } from 'src/tasks-column/tasks-column.model';
import { TasksValues } from 'src/tasks-values/tasks-values.model';
import { TasksColumnOptions } from './tasks-column-options.model';
import { AuthModule } from 'src/auth/auth.module';
import { UserProjects } from 'src/projects/user-projects.model';

@Module({
  controllers: [TasksColumnOptionsController],
  providers: [TasksColumnOptionsService],
  imports: [
    TypeOrmModule.forFeature([TasksColumn, TasksValues, TasksColumnOptions, UserProjects]),
    AuthModule
  ]
})
export class TasksColumnOptionsModule {}
