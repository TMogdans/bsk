import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from "typeorm";
import { Category } from "./Category";
import { Award } from "./Award";
import { Mechanic } from "./Mechanic";
import { Publisher } from "./Publisher";
import { Person } from "./Person";

@Entity()
export default class Boardgame extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "int2", unsigned: true })
  minAge: number;

  @Column({ type: "int2", unsigned: true })
  minNumberOfPlayers: number;

  @Column({ type: "int2", unsigned: true })
  maxNumberOfPlayers: number;

  @Column({ type: "int2", unsigned: true })
  minPlayTimeMinutes: number;

  @Column({ type: "int2", unsigned: true })
  maxPlayTimeMinutes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @VersionColumn()
  version: number;

  @ManyToMany(() => Award, (award) => award.boardgames, {
    cascade: true,
  })
  @JoinTable()
  awards: Award[];

  @ManyToMany(() => Category, (category) => category.boardgames, {
    cascade: true,
  })
  @JoinTable()
  categories: Category[];

  @ManyToMany(() => Mechanic, (mechanic) => mechanic.boardgames, {
    cascade: true,
  })
  @JoinTable()
  mechanics: Mechanic[];

  @ManyToMany(() => Publisher, (publisher) => publisher.boardgames, {
    cascade: true,
  })
  @JoinTable()
  publishers: Publisher[];

  @ManyToMany(() => Person, (person) => person.boardgamesDesigned, {
    cascade: true,
  })
  @JoinTable()
  designers: Person[];

  @ManyToMany(() => Person, (person) => person.boardgamesIllustrated, {
    cascade: true,
  })
  @JoinTable()
  artists: Person[];
}
