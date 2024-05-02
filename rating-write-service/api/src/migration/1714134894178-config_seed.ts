import {MigrationInterface, QueryRunner} from "typeorm";

export class ConfigSeed1714134894178 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO config ("name", "weight", "order") VALUES ('material_quality', 0.7, 0);
            INSERT INTO config ("name", "weight", "order") VALUES ('layout', 0.8, 1);
            INSERT INTO config ("name", "weight", "order") VALUES ('complexity', 0.4, 2);
            INSERT INTO config ("name", "weight", "order") VALUES ('difficulty', 0.5, 3);
            INSERT INTO config ("name", "weight", "order") VALUES ('fun', 1, 4);
            INSERT INTO config ("name", "weight", "order") VALUES ('variety', 0.6, 5);
            INSERT INTO config ("name", "weight", "order") VALUES ('replayability', 0.8, 6);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM config WHERE "name" = 'material_quality';
            DELETE FROM config WHERE "name" = 'layout';
            DELETE FROM config WHERE "name" = 'complexity';
            DELETE FROM config WHERE "name" = 'difficulty';
            DELETE FROM config WHERE "name" = 'fun';
            DELETE FROM config WHERE "name" = 'variety';
            DELETE FROM config WHERE "name" = 'replayability';
        `);
    }

}
