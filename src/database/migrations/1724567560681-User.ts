import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1724567560681 implements MigrationInterface {
  name = 'User1724567560681';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`verifyingEmailId\` int NULL COMMENT 'ID' AFTER \`password\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_0b53f0e339c36d4e46352473f1\` (\`verifyingEmailId\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_0b53f0e339c36d4e46352473f1\` ON \`user\` (\`verifyingEmailId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_0b53f0e339c36d4e46352473f1e\` FOREIGN KEY (\`verifyingEmailId\`) REFERENCES \`verifying_email\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_0b53f0e339c36d4e46352473f1e\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_0b53f0e339c36d4e46352473f1\` ON \`user\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP INDEX \`IDX_0b53f0e339c36d4e46352473f1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`verifyingEmailId\``,
    );
  }
}
