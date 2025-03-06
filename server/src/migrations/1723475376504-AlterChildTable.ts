import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AlterChildTable1723475376504 implements MigrationInterface {

  private table = 'child';
  public async up(queryRunner: QueryRunner): Promise<void> {
      if (await queryRunner.hasColumn(this.table, 'first_name')) {
          await queryRunner.dropColumn(this.table, 'first_name');

          await queryRunner.addColumn(
              this.table,
              new TableColumn({
                  name: 'first_name',
                  type: 'varchar',
                  isNullable: false,
              }),
          );
      } else {
          await queryRunner.addColumn(
              this.table,
              new TableColumn({
                  name: 'first_name',
                  type: 'varchar',
                  isNullable: false,
              }),
          );
      }
      if (await queryRunner.hasColumn(this.table, 'image_url')) {
        await queryRunner.dropColumn(this.table, 'image_url');

        await queryRunner.addColumn(
            this.table,
            new TableColumn({
                name: 'image_url',
                type: 'varchar',
                isNullable: true,
            }),
        );
    } else {
        await queryRunner.addColumn(
            this.table,
            new TableColumn({
                name: 'image_url',
                type: 'varchar',
                isNullable: true,
            }),
        );
    }
    if (await queryRunner.hasColumn(this.table, 'national_id')) {
      await queryRunner.dropColumn(this.table, 'national_id');

      await queryRunner.addColumn(
          this.table,
          new TableColumn({
              name: 'national_id',
              type: 'varchar',
              isNullable: true,
          }),
      );
  } else {
      await queryRunner.addColumn(
          this.table,
          new TableColumn({
              name: 'national_id',
              type: 'varchar',
              isNullable: true,
          }),
      );
  }
  if (await queryRunner.hasColumn(this.table, 'national_image')) {
    await queryRunner.dropColumn(this.table, 'national_image');

    await queryRunner.addColumn(
        this.table,
        new TableColumn({
            name: 'national_image',
            type: 'varchar',
            isNullable: true,
        }),
    );
} else {
    await queryRunner.addColumn(
        this.table,
        new TableColumn({
            name: 'national_image',
            type: 'varchar',
            isNullable: true,
        }),
    );
}
if (await queryRunner.hasColumn(this.table, 'birth_certificate')) {
  await queryRunner.dropColumn(this.table, 'birth_certificate');

  await queryRunner.addColumn(
      this.table,
      new TableColumn({
          name: 'birth_certificate',
          type: 'varchar',
          isNullable: true,
      }),
  );
} else {
  await queryRunner.addColumn(
      this.table,
      new TableColumn({
          name: 'birth_certificate',
          type: 'varchar',
          isNullable: true,
      }),
  );
}
if (await queryRunner.hasColumn(this.table, 'email')) {
  await queryRunner.dropColumn(this.table, 'email');

  await queryRunner.addColumn(
      this.table,
      new TableColumn({
          name: 'email',
          type: 'varchar',
          isNullable: true,
      }),
  );
} else {
  await queryRunner.addColumn(
      this.table,
      new TableColumn({
          name: 'email',
          type: 'varchar',
          isNullable: true,
      }),
  );
}

  }
  public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`DROP TABLE ${this.table}`);
  }

}
