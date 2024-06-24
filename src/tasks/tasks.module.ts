import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tasks } from './tasks.model';
import { AuthModule } from 'src/auth/auth.module';
import { UserProjects } from 'src/projects/user-projects.model';
import { Lists } from 'src/lists/lists.model';
import { TasksColumn } from 'src/tasks-column/tasks-column.model';
import { TasksValuesModule } from 'src/tasks-values/tasks-values.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [
    TypeOrmModule.forFeature([Tasks, UserProjects, Lists, TasksColumn]),
    AuthModule,
    TasksValuesModule
  ]
})
export class TasksModule {}
