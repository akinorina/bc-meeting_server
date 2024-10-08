import { MigrationInterface, QueryRunner } from 'typeorm';

export class Room1728374101905 implements MigrationInterface {
  name = 'Room1728374101905';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`room_attender\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'ID', \`peer_id\` varchar(255) NOT NULL COMMENT 'hash' DEFAULT '', \`createdAt\` datetime(6) NOT NULL COMMENT '作成日時' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '削除日時', \`roomId\` int NULL COMMENT 'ID', \`attenderId\` int NULL COMMENT 'ID', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`room\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'ID', \`room_hash\` varchar(255) NOT NULL COMMENT 'hash' DEFAULT '', \`room_name\` varchar(255) NOT NULL COMMENT 'ROOM名' DEFAULT '', \`createdAt\` datetime(6) NOT NULL COMMENT '作成日時' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '削除日時', \`userId\` int NULL COMMENT 'ID', UNIQUE INDEX \`IDX_58cfae7ea1d84124901b6c6b60\` (\`room_hash\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`blog\` DROP FOREIGN KEY \`FK_fc46ede0f7ab797b7ffacb5c08d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`blog\` CHANGE \`userId\` \`userId\` int NULL COMMENT 'ID'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`blog\` ADD CONSTRAINT \`FK_fc46ede0f7ab797b7ffacb5c08d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`room_attender\` ADD CONSTRAINT \`FK_e581e5ba5e744f80e6d54509332\` FOREIGN KEY (\`roomId\`) REFERENCES \`room\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`room_attender\` ADD CONSTRAINT \`FK_d16b68c51cecb2122c00e415727\` FOREIGN KEY (\`attenderId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`room\` ADD CONSTRAINT \`FK_0468c843ad48d3455e48d40ddd4\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`room\` DROP FOREIGN KEY \`FK_0468c843ad48d3455e48d40ddd4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`room_attender\` DROP FOREIGN KEY \`FK_d16b68c51cecb2122c00e415727\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`room_attender\` DROP FOREIGN KEY \`FK_e581e5ba5e744f80e6d54509332\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`blog\` DROP FOREIGN KEY \`FK_fc46ede0f7ab797b7ffacb5c08d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`blog\` CHANGE \`userId\` \`userId\` int NULL COMMENT 'ユーザーID'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`blog\` ADD CONSTRAINT \`FK_fc46ede0f7ab797b7ffacb5c08d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_58cfae7ea1d84124901b6c6b60\` ON \`room\``,
    );
    await queryRunner.query(`DROP TABLE \`room\``);
    await queryRunner.query(`DROP TABLE \`room_attender\``);
  }
}
