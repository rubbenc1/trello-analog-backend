import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserProjects } from "./user-projects.model";
import { Lists } from "src/lists/lists.model";
import { TasksColumn } from "src/tasks-column/tasks-column.model";



@Entity({name: 'projects'})
export class Project {

  @ApiProperty({example: '1', description: 'Project ID'})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({example: 'Build a pyramide', description: 'Project name...'})
  @Column({ nullable: false })
  name: string;

  @CreateDateColumn({type:'timestamp'})
  createdAt: Date;

  @UpdateDateColumn({type:'timestamp'})
  updatedAt: Date;

  @OneToMany(()=> UserProjects, userProjects=>userProjects.project, {cascade: true})
  userProjects: UserProjects[]

  @OneToMany(()=>Lists, (list)=>list.project, {cascade:true})
  lists: Lists[];

  @OneToMany(()=>TasksColumn, taskColumn => taskColumn.project, {cascade: true})
  tasksColumns: TasksColumn[];
}