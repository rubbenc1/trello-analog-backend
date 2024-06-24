import { ApiProperty } from "@nestjs/swagger";
import { Project } from "src/projects/projects.model";
import { Tasks } from "src/tasks/tasks.model";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";


@Entity({name: 'lists'})
@Unique(['project', 'name'])
@Unique(['project', 'position'])
export class Lists {

    @ApiProperty({example: '1', description: 'ID'})
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({example: 'To do', description: 'List name of its tasks'})
    @Column({nullable: false})
    name: string;

    @ApiProperty({example: '3', description: 'List position among project lists'})
    @Column({nullable: true})
    position: number;

    @ManyToOne(()=>Project, (project) => project.lists, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'projectId'})
    project: Project;

    @Column()
    projectId: number;

    @OneToMany(()=>Tasks, (task)=>task.list, {cascade: true})
    tasks: Tasks[];
}