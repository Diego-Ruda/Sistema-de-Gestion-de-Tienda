import { MigrationInterface, QueryRunner } from "typeorm";

export class AgregarDescripcionProducto1769813266905 implements MigrationInterface {
    name = 'AgregarDescripcionProducto1769813266905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "producto" ADD "descripcion" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "producto" DROP COLUMN "descripcion"`);
    }

}
