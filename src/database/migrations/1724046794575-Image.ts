import { MigrationInterface, QueryRunner } from 'typeorm';

export class Image1724046794575 implements MigrationInterface {
  name = 'Image1724046794575';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`image\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'ID', \`name\` varchar(255) NOT NULL COMMENT '画像表示名' DEFAULT '', \`bucket\` varchar(255) NOT NULL COMMENT 'Bucket名' DEFAULT '', \`objectKey\` varchar(255) NOT NULL COMMENT 'オブジェクトキー' DEFAULT '', \`path\` varchar(255) NOT NULL COMMENT 'PATH' DEFAULT '', \`createdAt\` datetime(6) NOT NULL COMMENT '作成日時' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '削除日時', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`image\``);
  }
}
