import { MigrationInterface, QueryRunner } from 'typeorm';

export class VerifyingEmail1724567089890 implements MigrationInterface {
  name = 'VerifyingEmail1724567089890';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`verifying_email\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'ID', \`email\` varchar(255) NOT NULL COMMENT 'メールアドレス' DEFAULT '', \`hash\` varchar(255) NOT NULL COMMENT 'ハッシュ値' DEFAULT '', \`verifiedEmailAt\` datetime NOT NULL COMMENT 'email確認済日時', \`createdAt\` datetime(6) NOT NULL COMMENT '作成日時' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '削除日時', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`verifying_email\``);
  }
}
