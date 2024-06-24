import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from './users/users.module';
import { User } from "./users/users.model";
import { AuthModule } from './auth/auth.module';
import { Project } from "./projects/projects.model";
import { ProjectsModule } from "./projects/projects.module";
import { UserProjects } from "./projects/user-projects.model";
import { TasksModule } from './tasks/tasks.module';
import { Tasks } from "./tasks/tasks.model";
import { ListsModule } from './lists/lists.module';
import { Lists } from "./lists/lists.model";
import { TasksColumnModule } from './tasks-column/tasks-column.module';
import { TasksColumn } from "./tasks-column/tasks-column.model";
import { TasksValuesModule } from './tasks-values/tasks-values.module';
import { TasksValues } from "./tasks-values/tasks-values.model";
import { TasksColumnOptionsModule } from './tasks-column-options/tasks-column-options.module';
import { TasksColumnOptions } from "./tasks-column-options/tasks-column-options.model";


@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env`,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            entities: [User, Project, UserProjects, Tasks, Lists, TasksColumn, TasksValues, TasksColumnOptions],
            synchronize: true,
        }),
        UsersModule,
        AuthModule,
        ProjectsModule,
        TasksModule,
        ListsModule,
        TasksColumnModule,
        TasksValuesModule,
        TasksColumnOptionsModule
    ]
})
export class AppModule {}
