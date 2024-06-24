import { ApiProperty } from '@nestjs/swagger';
import { UserProjects } from 'src/projects/user-projects.model';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity({name: 'users'})
export class User {

  @ApiProperty({example: '1', description: 'user id'})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({example: 'amri', description: 'Username'})
  @Column({ unique: true, nullable: false })
  username: string;

  @ApiProperty({example: 'user@mail.ru', description: 'User mail'})
  @Column({ unique: true, nullable: false })
  email: string;

  @ApiProperty({example: '12345678', description: 'User password'})
  @Column({ nullable: false })
  password: string;

  @OneToMany(()=>UserProjects, userProjects=>userProjects.user, {cascade: true})
  userProjects: UserProjects[];
}
