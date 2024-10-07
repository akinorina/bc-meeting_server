import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1723705099124 implements MigrationInterface {
  name = 'User1723705099124';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'ID', \`username\` varchar(255) NOT NULL COMMENT 'ユーザー名' DEFAULT '', \`familyname\` varchar(255) NOT NULL COMMENT '姓' DEFAULT '', \`firstname\` varchar(255) NOT NULL COMMENT '名' DEFAULT '', \`familynameKana\` varchar(255) NOT NULL COMMENT '姓かな' DEFAULT '', \`firstnameKana\` varchar(255) NOT NULL COMMENT '名かな' DEFAULT '', \`email\` varchar(255) NOT NULL COMMENT 'メールアドレス' DEFAULT '', \`password\` varchar(255) NOT NULL COMMENT 'パスワード' DEFAULT '', \`createdAt\` datetime(6) NOT NULL COMMENT '作成日時' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '削除日時', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
