import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AlterChildMartialStatusTable1724831779493 implements MigrationInterface {

  private table = 'child_marital_status';
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn(this.table, 'guardian_name')) {
      await queryRunner.dropColumn(this.table, 'guardian_name');

      await queryRunner.addColumn(
          this.table,
          new TableColumn({
              name: 'guardian_name',
              type: 'varchar',
              isNullable: true,
          }),
      );
  } else {
      await queryRunner.addColumn(
          this.table,
          new TableColumn({
              name: 'guardian_name',
              type: 'varchar',
              isNullable: true,
          }),
      );
  }
  if (await queryRunner.hasColumn(this.table, 'guardian_national_iD')) {
    await queryRunner.dropColumn(this.table, 'guardian_national_iD');

    await queryRunner.addColumn(
        this.table,
        new TableColumn({
            name: 'guardian_national_iD',
            type: 'varchar',
            isNullable: true,
        }),
    );
} else {
    await queryRunner.addColumn(
        this.table,
        new TableColumn({
            name: 'guardian_national_iD',
            type: 'varchar',
            isNullable: true,
        }),
    );
}
if (await queryRunner.hasColumn(this.table, 'guardian_relationship')) {
  await queryRunner.dropColumn(this.table, 'guardian_relationship');

  await queryRunner.addColumn(
      this.table,
      new TableColumn({
          name: 'guardian_relationship',
          type: 'varchar',
          isNullable: true,
      }),
  );
} else {
  await queryRunner.addColumn(
      this.table,
      new TableColumn({
          name: 'guardian_relationship',
          type: 'varchar',
          isNullable: true,
      }),
  );
}
if (await queryRunner.hasColumn(this.table, 'guardian_document')) {
  await queryRunner.dropColumn(this.table, 'guardian_document');

  await queryRunner.addColumn(
      this.table,
      new TableColumn({
          name: 'guardian_document',
          type: 'varchar',
          isNullable: true,
      }),
  );
} else {
  await queryRunner.addColumn(
      this.table,
      new TableColumn({
          name: 'guardian_document',
          type: 'varchar',
          isNullable: true,
      }),
  );
}

if (await queryRunner.hasColumn(this.table, 'lost_housing')) {
  await queryRunner.dropColumn(this.table, 'lost_housing');

  await queryRunner.addColumn(
      this.table,
      new TableColumn({
          name: 'lost_housing',
          type: 'boolean',
          isNullable: true,
      }),
  );
} else {
  await queryRunner.addColumn(
      this.table,
      new TableColumn({
          name: 'lost_housing',
          type: 'boolean',
          isNullable: true,
      }),
  );
}
if (await queryRunner.hasColumn(this.table, 'lost_housing')) {
  await queryRunner.dropColumn(this.table, 'lost_housing');

  await queryRunner.addColumn(
      this.table,
      new TableColumn({
          name: 'lost_housing',
          type: 'boolean',
          isNullable: true,
      }),
  );
} else {
  await queryRunner.addColumn(
      this.table,
      new TableColumn({
          name: 'lost_housing',
          type: 'boolean',
          isNullable: true,
      }),
  );
}
if (await queryRunner.hasColumn(this.table, 'lost_limbs')) {
  await queryRunner.dropColumn(this.table, 'lost_limbs');

  await queryRunner.addColumn(
      this.table,
      new TableColumn({
          name: 'lost_limbs',
          type: 'boolean',
          isNullable: true,
      }),
  );
} else {
  await queryRunner.addColumn(
      this.table,
      new TableColumn({
          name: 'lost_limbs',
          type: 'boolean',
          isNullable: true,
      }),
  );
}
if (await queryRunner.hasColumn(this.table, 'lost_sight')) {
  await queryRunner.dropColumn(this.table, 'lost_sight');

  await queryRunner.addColumn(
      this.table,
      new TableColumn({
          name: 'lost_sight',
          type: 'boolean',
          isNullable: true,
      }),
  );
} else {
  await queryRunner.addColumn(
      this.table,
      new TableColumn({
          name: 'lost_sight',
          type: 'boolean',
          isNullable: true,
      }),
  );
}
if (await queryRunner.hasColumn(this.table, 'losthearorspeak')) {
  await queryRunner.dropColumn(this.table, 'losthearorspeak');

  await queryRunner.addColumn(
      this.table,
      new TableColumn({
          name: 'losthearorspeak',
          type: 'boolean',
          isNullable: true,
      }),
  );
} else {
  await queryRunner.addColumn(
      this.table,
      new TableColumn({
          name: 'losthearorspeak',
          type: 'boolean',
          isNullable: true,
      }),
  );
}
if (await queryRunner.hasColumn(this.table, 'has_chronic_diseases')) {
  await queryRunner.dropColumn(this.table, 'has_chronic_diseases');

  await queryRunner.addColumn(
      this.table,
      new TableColumn({
          name: 'has_chronic_diseases',
          type: 'boolean',
          isNullable: true,
      }),
  );
} else {
  await queryRunner.addColumn(
      this.table,
      new TableColumn({
          name: 'has_chronic_diseases',
          type: 'boolean',
          isNullable: true,
      }),
  );
}


  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}
