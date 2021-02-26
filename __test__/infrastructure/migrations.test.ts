'use strict';
import { map, values, keyBy } from 'lodash';
import { exec } from 'child_process';

import db from '../../models';
import Migration from '../../services/migration';

const { sequelize } = db;

async function dropTables() {
  return await sequelize.queryInterface.dropAllTables();
}

async function readSchema() {
  let dbName = process.env.SQL_DATABASE;
  let command = `pg_dump -O -s -x ${dbName} | egrep -v "(^SET|EXTENSION|COMMENT|^/\*\!)"`;
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout);
      }
    });
  });
}

async function listForeignKeys() {
  const query = `
    SELECT tc.constraint_name,
      tc.constraint_type,
      tc.table_name,
      kcu.column_name,
      tc.is_deferrable,
      tc.initially_deferred,
      rc.match_option AS match_type,
      rc.update_rule AS on_update,
      rc.delete_rule AS on_delete,
      ccu.table_name AS references_table,
      ccu.column_name AS references_field
    FROM information_schema.table_constraints tc
    LEFT JOIN information_schema.key_column_usage kcu
      ON tc.constraint_catalog = kcu.constraint_catalog
      AND tc.constraint_schema = kcu.constraint_schema
      AND tc.constraint_name = kcu.constraint_name
    LEFT JOIN information_schema.referential_constraints rc
      ON tc.constraint_catalog = rc.constraint_catalog
      AND tc.constraint_schema = rc.constraint_schema
      AND tc.constraint_name = rc.constraint_name
    LEFT JOIN information_schema.constraint_column_usage ccu
      ON rc.unique_constraint_catalog = ccu.constraint_catalog
      AND rc.unique_constraint_schema = ccu.constraint_schema
      AND rc.unique_constraint_name = ccu.constraint_name
    WHERE lower(tc.constraint_type) in ('foreign key')
  `;

  const records = await db.sequelize.query(query);

  return records[0];
}

describe('Sequelize migration', function () {
  let migration;

  beforeEach(async function () {
    migration = new Migration();
    // Setup the database
    await dropTables();
  });

  afterAll(async () => {
    // Setup the database
    await dropTables();
  });

  test('should run migrations', async () => {
    await migration.up();
  });

  test('should run sync', async () => {
    await sequelize.sync({ force: true });
  });

  test('migrate should be equal to sync', async () => {
    const qi = sequelize.getQueryInterface();

    await dropTables();
    await migration.up();

    const models = map(sequelize.models);
    const migratedFC = keyBy(await listForeignKeys(), 'constraint_name');

    // const migratedSchema = await readSchema();
    const migratedSchema = {};
    for (let m of models) {
      let tableName = (m as any).getTableName();
      migratedSchema[tableName] = await qi.describeTable(tableName);
      migratedSchema[tableName].indexes = await qi.showIndex(tableName);

      for (let i of migratedSchema[tableName].indexes) {
        delete i.indkey;
      }
    }

    await dropTables();
    await sequelize.sync({ force: true });
    // const syncedSchema = await readSchema();
    const syncedFC = keyBy(await listForeignKeys(), 'constraint_name');

    const syncedSchema = {};
    for (let m of models) {
      let tableName = (m as any).getTableName();
      syncedSchema[tableName] = await qi.describeTable(tableName);
      syncedSchema[tableName].indexes = await qi.showIndex(tableName);

      for (let i of syncedSchema[tableName].indexes) {
        delete i.indkey;
      }
    }

    // console.log(migratedFC);

    for (let sc of values(syncedFC)) {
      const scString = JSON.stringify(sc, null, 2);
      const mcString = JSON.stringify(migratedFC[sc.constraint_name], null, 2);

      const migrationString = `
      await queryInterface.addConstraint('${sc.table_name}', ['${sc.column_name}'], {
        type: '${sc.constraint_type}',
        name: '${sc.constraint_name}',
        references: { //Required field
          table: '${sc.references_table}',
          field: '${sc.references_field}'
        },
        onDelete: '${sc.on_delete}',
        onUpdate: '${sc.on_update}'
      });
      `;

      // expect(
      //   migratedFC[sc.constraint_name],
      // ).toBeDefined(`FC: ${sc.constraint_name} missing in Migrated Schema (${migrationString})`);

      try {
        expect(sc).toEqual(migratedFC[sc.constraint_name] || {});
      } catch (e) {
        e.message = `Mismatch FC: ${migrationString}`;
        e.showDiff = true;
        e.actual = sc;
        e.expected = migratedFC[sc.constraint_name];
        throw e;
      }
    }

    expect(migratedSchema).toEqual(syncedSchema);
  });
});
