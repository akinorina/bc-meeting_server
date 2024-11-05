import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1730794613882 implements MigrationInterface {
  name = 'User1730794613882';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`agreeTerms\` tinyint NOT NULL COMMENT '利用規約への同意' DEFAULT '0' AFTER \`password\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`room_attender\` DROP FOREIGN KEY \`FK_e581e5ba5e744f80e6d54509332\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`room_attender\` CHANGE \`peer_id\` \`peer_id\` varchar(255) NOT NULL COMMENT 'hash' DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE \`room_attender\` CHANGE \`roomId\` \`roomId\` int NULL COMMENT 'ID'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`room\` DROP FOREIGN KEY \`FK_0468c843ad48d3455e48d40ddd4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`room\` CHANGE \`userId\` \`userId\` int NULL COMMENT 'ID'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`room_attender\` ADD CONSTRAINT \`FK_e581e5ba5e744f80e6d54509332\` FOREIGN KEY (\`roomId\`) REFERENCES \`room\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE \`room_attender\` DROP FOREIGN KEY \`FK_e581e5ba5e744f80e6d54509332\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`room\` CHANGE \`userId\` \`userId\` int NULL COMMENT 'User ID'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`room\` ADD CONSTRAINT \`FK_0468c843ad48d3455e48d40ddd4\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`room_attender\` CHANGE \`roomId\` \`roomId\` int NULL COMMENT 'Room ID'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`room_attender\` CHANGE \`peer_id\` \`peer_id\` varchar(255) NOT NULL COMMENT 'Peer ID' DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE \`room_attender\` ADD CONSTRAINT \`FK_e581e5ba5e744f80e6d54509332\` FOREIGN KEY (\`roomId\`) REFERENCES \`room\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`agreeTerms\``);
  }
}
