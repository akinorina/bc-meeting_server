import { MigrationInterface, QueryRunner } from 'typeorm';

export class Role1723708636282 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO \`role\` (\`id\`, \`name\`, \`createdAt\`, \`updatedAt\`, \`deletedAt\`) VALUES ('1', 'admin', '2024-08-15 00:00:00.000000', '2024-08-15 00:00:00.000000', NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO \`role\` (\`id\`, \`name\`, \`createdAt\`, \`updatedAt\`, \`deletedAt\`) VALUES ('2', 'user', '2024-08-15 00:00:00.000000', '2024-08-15 00:00:00.000000', NULL)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM \`role\` WHERE \`id\` = 1`);
    await queryRunner.query(`DELETE FROM \`role\` WHERE \`id\` = 2`);
  }
}
