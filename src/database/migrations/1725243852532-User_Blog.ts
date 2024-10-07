import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserBlog1725243852532 implements MigrationInterface {
  name = 'UserBlog1725243852532';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`blog\` ADD \`userId\` int NULL COMMENT 'ユーザーID' AFTER \`id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`blog\` ADD CONSTRAINT \`FK_fc46ede0f7ab797b7ffacb5c08d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`blog\` DROP FOREIGN KEY \`FK_fc46ede0f7ab797b7ffacb5c08d\``,
    );
    await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`userId\``);
  }
}
