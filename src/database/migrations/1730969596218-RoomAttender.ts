import { MigrationInterface, QueryRunner } from 'typeorm';

export class RoomAttender1730969596218 implements MigrationInterface {
  name = 'RoomAttender1730969596218';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`room_attender\` ADD \`display_name\` varchar(255) NOT NULL COMMENT '表示名' DEFAULT '' AFTER \`peer_id\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`room_attender\` DROP COLUMN \`display_name\``,
    );
  }
}
