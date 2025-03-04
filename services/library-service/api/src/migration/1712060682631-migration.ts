import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex} from "typeorm";

export class Migration1712060682631 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)

    await queryRunner.createTable(
      new Table({
        name: "award",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "name",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "slug",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      "award",
      new TableIndex({
        name: "IDX_AWARD_SLUG",
        columnNames: ["slug"],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "category",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "name",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "slug",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      "category",
      new TableIndex({
        name: "IDX_CATEGORY_SLUG",
        columnNames: ["slug"],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "mechanic",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "slug",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      "mechanic",
      new TableIndex({
        name: "IDX_MECHANIC_SLUG",
        columnNames: ["slug"],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "person",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "firstName",
            type: "varchar",
          },
          {
            name: "lastName",
            type: "varchar",
          },
          {
            name: "slug",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      "person",
      new TableIndex({
        name: "IDX_PERSON_SLUG",
        columnNames: ["slug"],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "publisher",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "name",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "slug",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      "publisher",
      new TableIndex({
        name: "IDX_PUBLISHER_SLUG",
        columnNames: ["slug"],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "boardgame",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "name",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "slug",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "minAge",
            type: "smallint",
          },
          {
            name: "minNumberOfPlayers",
            type: "smallint",
          },
          {
            name: "maxNumberOfPlayers",
            type: "smallint",
          },
          {
            name: "minPlayTimeMinutes",
            type: "smallint",
          },
          {
            name: "maxPlayTimeMinutes",
            type: "smallint",
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "deletedAt",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "version",
            type: "int",
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      "boardgame",
      new TableIndex({
        name: "IDX_BOARDGAME_SLUG",
        columnNames: ["slug"],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "boardgame_categories_category",
        columns: [
          {
            name: "boardgameId",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "categoryId",
            type: "uuid",
            isPrimary: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "boardgame_categories_category",
      new TableForeignKey({
        columnNames: ["boardgameId"],
        referencedColumnNames: ["id"],
        referencedTableName: "boardgame",
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "boardgame_categories_category",
      new TableForeignKey({
        columnNames: ["categoryId"],
        referencedColumnNames: ["id"],
        referencedTableName: "category",
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "boardgame_mechanics_mechanic",
        columns: [
          {
            name: "boardgameId",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "mechanicId",
            type: "uuid",
            isPrimary: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "boardgame_mechanics_mechanic",
      new TableForeignKey({
        columnNames: ["boardgameId"],
        referencedColumnNames: ["id"],
        referencedTableName: "boardgame",
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "boardgame_mechanics_mechanic",
      new TableForeignKey({
        columnNames: ["mechanicId"],
        referencedColumnNames: ["id"],
        referencedTableName: "mechanic",
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "boardgame_publishers_publisher",
        columns: [
          {
            name: "boardgameId",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "publisherId",
            type: "uuid",
            isPrimary: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "boardgame_publishers_publisher",
      new TableForeignKey({
        columnNames: ["boardgameId"],
        referencedColumnNames: ["id"],
        referencedTableName: "boardgame",
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "boardgame_publishers_publisher",
      new TableForeignKey({
        columnNames: ["publisherId"],
        referencedColumnNames: ["id"],
        referencedTableName: "publisher",
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "boardgame_awards_award",
        columns: [
          {
            name: "boardgameId",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "awardId",
            type: "uuid",
            isPrimary: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "boardgame_awards_award",
      new TableForeignKey({
        columnNames: ["boardgameId"],
        referencedColumnNames: ["id"],
        referencedTableName: "boardgame",
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "boardgame_awards_award",
      new TableForeignKey({
        columnNames: ["awardId"],
        referencedColumnNames: ["id"],
        referencedTableName: "award",
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "boardgame_designers_person",
        columns: [
          {
            name: "boardgameId",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "personId",
            type: "uuid",
            isPrimary: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "boardgame_designers_person",
      new TableForeignKey({
        columnNames: ["boardgameId"],
        referencedColumnNames: ["id"],
        referencedTableName: "boardgame",
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "boardgame_designers_person",
      new TableForeignKey({
        columnNames: ["personId"],
        referencedColumnNames: ["id"],
        referencedTableName: "person",
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "boardgame_artists_person",
        columns: [
          {
            name: "boardgameId",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "personId",
            type: "uuid",
            isPrimary: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "boardgame_artists_person",
      new TableForeignKey({
        columnNames: ["boardgameId"],
        referencedColumnNames: ["id"],
        referencedTableName: "boardgame",
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "boardgame_artists_person",
      new TableForeignKey({
        columnNames: ["personId"],
        referencedColumnNames: ["id"],
        referencedTableName: "person",
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "link",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "url",
            type: "varchar",
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "boardgameId",
            type: "uuid",
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "link",
      new TableForeignKey({
        columnNames: ["boardgameId"],
        referencedColumnNames: ["id"],
        referencedTableName: "boardgame",
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "image",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "url",
            type: "varchar",
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "boardgameId",
            type: "uuid",
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "image",
      new TableForeignKey({
        columnNames: ["boardgameId"],
        referencedColumnNames: ["id"],
        referencedTableName: "boardgame",
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
