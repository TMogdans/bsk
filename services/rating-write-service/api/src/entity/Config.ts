import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Rating} from "./Rating";

@Entity()
export class Config extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({unique: true})
    name: string;

    @Column({default: 1.0, type: "float"})
    weight: number;

    @Column()
    order: number;

    @OneToMany(() => Rating, (rating) => rating.config)
    ratings: Rating[];
}
