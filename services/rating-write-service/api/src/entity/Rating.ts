import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Config} from "./Config";

@Entity()
@Index(["configId", "userId", "objectId"], {unique: true})
export class Rating extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    configId: string;

    @Column()
    userId: string;

    @Column()
    objectId: string;

    @Column()
    value: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Config, (config) => config.ratings)
    config: Config;
}