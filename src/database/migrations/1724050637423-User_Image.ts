import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserImage1724050637423 implements MigrationInterface {
  name = 'UserImage1724050637423';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`image\` ADD \`userId\` int NULL COMMENT 'ID' AFTER \`id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`image\` ADD CONSTRAINT \`FK_dc40417dfa0c7fbd70b8eb880cc\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`image\` DROP FOREIGN KEY \`FK_dc40417dfa0c7fbd70b8eb880cc\``,
    );
    await queryRunner.query(`ALTER TABLE \`image\` DROP COLUMN \`userId\``);
  }
}
