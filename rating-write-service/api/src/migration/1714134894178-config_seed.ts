import { MigrationInterface, QueryRunner } from "typeorm";

export class ConfigSeed1714134894178 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO configs (name, weight, "order") VALUES ('material_quality', 0.7, 0);
            INSERT INTO configs (name, weight, "order") VALUES ('layout', 0.8, 1);
            INSERT INTO configs (name, weight, "order") VALUES ('complexity', 0.4, 2);
            INSERT INTO configs (name, weight, "order") VALUES ('difficulty', 0.5, 3);
            INSERT INTO configs (name, weight, "order") VALUES ('fun', 1, 4);
            INSERT INTO configs (name, weight, "order") VALUES ('variety', 0.6, 5);
            INSERT INTO configs (name, weight, "order") VALUES ('replayability', 0.8, 6);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
