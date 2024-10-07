import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1723709112435 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO \`user\`(\`id\`, \`username\`, \`familyname\`, \`firstname\`, \`familynameKana\`, \`firstnameKana\`, \`email\`, \`password\`, \`createdAt\`, \`updatedAt\`, \`deletedAt\`) VALUES(\'1\', \'admin\', \'システム\', \'管理者\', \'しすてむ\', \'かんりしゃ\', \'admin@example.com\', \'8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918\', \'2024-08-15 00:00:00.000000\', \'2024-08-15 00:00:00.000000\', NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO \`user_roles_role\` (\`userId\`, \`roleId\`) VALUES (\'1\', \'1\'), (\'1\', \'2\');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM \`user_roles_role\` WHERE \`userId\` IN (\'1\')`,
    );
    await queryRunner.query(`DELETE FROM \`user\` WHERE \`id\` = 1`);
  }
}
