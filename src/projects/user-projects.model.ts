import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./projects.model";
import { User } from "src/users/users.model";



@Entity({name: "user-projects"})
export class UserProjects{
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(()=>Project, project => project.id, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'projectId'})
    project: Project

    @Column()
    projectId: number;

    @ManyToOne(()=>User, user => user.id, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'userId'})
    user: User

    @Column()
    userId: number;
}