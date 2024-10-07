import { MigrationInterface, QueryRunner } from 'typeorm';

export class VerifyingEmail1724570289332 implements MigrationInterface {
  name = 'VerifyingEmail1724570289332';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_0b53f0e339c36d4e46352473f1\` ON \`user\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`verifying_email\` CHANGE \`verifiedEmailAt\` \`verifiedEmailAt\` datetime NULL COMMENT 'email確認済日時'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`verifying_email\` CHANGE \`verifiedEmailAt\` \`verifiedEmailAt\` datetime NOT NULL COMMENT 'email確認済日時'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_0b53f0e339c36d4e46352473f1\` ON \`user\` (\`verifyingEmailId\`)`,
    );
  }
}
