import { ApiProperty } from "@nestjs/swagger";
import { Project } from "src/projects/projects.model";
import { TasksColumnOptions } from "src/tasks-column-options/tasks-column-options.model";
import { TasksValues } from "src/tasks-values/tasks-values.model";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'tasks-column'})
export class TasksColumn {

    @ApiProperty({example: '1', description: 'column id'})
    @PrimaryGeneratedColumn()
    columnId: number;

    @ApiProperty({example: 'Assigned to', description: 'column name'})
    @Column()
    name: string;

    
    @ManyToOne(()=> Project, (project)=>project.tasksColumns, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'projectId'})
    project: Project
    @Column()
    projectId: number;

    @OneToMany(()=>TasksValues, (values)=> values.column, {cascade: true})
    tasksValue: TasksValues[]

    @OneToMany(()=>TasksColumnOptions, (option)=>option.column, {cascade: true})
    options: TasksColumnOptions[];
}