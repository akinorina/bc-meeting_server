import { MigrationInterface, QueryRunner } from 'typeorm';

export class Blog1724663983737 implements MigrationInterface {
  name = 'Blog1724663983737';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`blog\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'ID', \`subject\` varchar(255) NOT NULL COMMENT '主題' DEFAULT '', \`body\` text NOT NULL COMMENT '本文', \`createdAt\` datetime(6) NOT NULL COMMENT '作成日時' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '削除日時', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`blog\``);
  }
}
