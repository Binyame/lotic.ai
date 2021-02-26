import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    dataPrints {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    dataPrint(id: $id) {
      id
      patient {
        id
      }
    }
  }
`;

const CREATE = `
  mutation create($dataPrint: DataPrintCreate) {
    createDataPrint(dataPrint: $dataPrint) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($dataPrint: DataPrintUpdate) {
    updateDataPrint(dataPrint: $dataPrint) {
      id
      svg
    }
  }
`;

const DESTROY = `
  mutation destroy($dataPrint: DataPrintDestroy) {
    destroyDataPrint(dataPrint: $dataPrint) {
      id
    }
  }
`;

describe('Integration - DataPrint', () => {
    let record;

    beforeAll(async () => {
        record = await factory.create('DataPrint');
        await factory.create('DataPrint');
        await factory.create('DataPrint');
    });

    describe('Anonymous', () => {
        test('should NOT list', async () => {
            const res = await query(LIST);

            expect(res.body.data.dataPrints).toBeNull();
            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].message).toMatch('Not authorized');
        });
        test('should NOT read', async () => {
            const res = await query(READ, { id: record.id });

            expect(res.body.data.dataPrint).toBeNull();
            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].message).toMatch('Not authorized');
        });
        test('should NOT create', async () => {
            const attrs = await factory.attrs('DataPrint');
            const variables = {
                dataPrint: attrs
            };

            const res = await mutate(CREATE, variables);

            expect(res.body.data.createDataPrint).toBeNull();
            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].message).toMatch('Not authorized');
        });
        test('should NOT update', async () => {
            const variables = {
                dataPrint: {
                    id: record.id,
                    svg: 'svg'
                }
            }
            const res = await mutate(UPDATE, variables);

            expect(res.body.data.updateDataPrint).toBeNull();
            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].message).toMatch('Not authorized');
        });
        test('should NOT destroy', async () => {
            const variables = {
                dataPrint: {
                    id: record.id,
                }
            }
            const res = await mutate(DESTROY, variables);

            expect(res.body.data.destroyDataPrint).toBeNull();
            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].message).toMatch('Not authorized');
        });
    });
    describe('LoticUser: without Permissions', () => {
        let token;

        beforeAll(async () => {
            const usr = await factory.create('LoticUser');
            token = await usr.token();
        });

        test('should NOT list', async () => {
            const res = await query(LIST, undefined, token);

            expect(res.body.data.dataPrints).toBeNull();
            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].message).toMatch('dataPrint.list');
        });
        test('should NOT read', async () => {
            const res = await query(READ, { id: record.id }, token);

            expect(res.body.data.dataPrint).toBeNull();
            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].message).toMatch('dataPrint.read');
        });
        test('should NOT create', async () => {
            const attrs = await factory.attrs('DataPrint');
            const variables = {
                dataPrint: attrs
            };

            const res = await mutate(CREATE, variables, token);

            expect(res.body.data.createDataPrint).toBeNull();
            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].message).toMatch('dataPrint.create');
        });
        test('should NOT update', async () => {
            const variables = {
                dataPrint: {
                    id: record.id,
                    svg: 'svg'
                }
            }
            const res = await mutate(UPDATE, variables, token);

            expect(res.body.data.updateDataPrint).toBeNull();
            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].message).toMatch('dataPrint.update');
        });
        test('should NOT destroy', async () => {
            const variables = {
                dataPrint: {
                    id: record.id,
                }
            }
            const res = await mutate(DESTROY, variables, token);

            expect(res.body.data.destroyDataPrint).toBeNull();
            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].message).toMatch('dataPrint.destroy');
        });
    });
    describe('Clinician: without Permissions', () => {
        let token;

        beforeAll(async () => {
            const usr = await factory.create('Clinician');
            token = await usr.token();
        });

        test('should NOT list', async () => {
            const res = await query(LIST, undefined, token);

            expect(res.body.data.dataPrints).toBeNull();
            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].message).toMatch('dataPrint.list');
        });
        test('should NOT read', async () => {
            const res = await query(READ, { id: record.id }, token);

            expect(res.body.data.dataPrint).toBeNull();
            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].message).toMatch('dataPrint.read');
        });
        test('should NOT create', async () => {
            const attrs = await factory.attrs('DataPrint');
            const variables = {
                dataPrint: attrs
            };

            const res = await mutate(CREATE, variables, token);

            expect(res.body.data.createDataPrint).toBeNull();
            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].message).toMatch('dataPrint.create');
        });
        test('should NOT update', async () => {
            const variables = {
                dataPrint: {
                    id: record.id,
                    svg: 'svg'
                }
            }
            const res = await mutate(UPDATE, variables, token);

            expect(res.body.data.updateDataPrint).toBeNull();
            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].message).toMatch('dataPrint.update');
        });
        test('should NOT destroy', async () => {
            const variables = {
                dataPrint: {
                    id: record.id,
                }
            }
            const res = await mutate(DESTROY, variables, token);

            expect(res.body.data.destroyDataPrint).toBeNull();
            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].message).toMatch('dataPrint.destroy');
        });
    });
    describe('Patient: without Permissions', () => {
        let token;

        beforeAll(async () => {
            const usr = await factory.create('Patient');
            token = await usr.token();
        });

        test('should NOT list', async () => {
            const res = await query(LIST, undefined, token);

            expect(res.body.data.dataPrints).toBeNull();
            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].message).toMatch('dataPrint.list');
        });
        test('should NOT read', async () => {
            const res = await query(READ, { id: record.id }, token);

            expect(res.body.data.dataPrint).toBeNull();
            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].message).toMatch('dataPrint.read');
        });
        test('should NOT create', async () => {
            const attrs = await factory.attrs('DataPrint');
            const variables = {
                dataPrint: attrs
            };

            const res = await mutate(CREATE, variables, token);

            expect(res.body.data.createDataPrint).toBeNull();
            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].message).toMatch('dataPrint.create');
        });
        test('should NOT update', async () => {
            const variables = {
                dataPrint: {
                    id: record.id,
                    svg: 'svg'
                }
            }
            const res = await mutate(UPDATE, variables, token);

            expect(res.body.data.updateDataPrint).toBeNull();
            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].message).toMatch('dataPrint.update');
        });
        test('should NOT destroy', async () => {
            const variables = {
                dataPrint: {
                    id: record.id,
                }
            }
            const res = await mutate(DESTROY, variables, token);

            expect(res.body.data.destroyDataPrint).toBeNull();
            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].message).toMatch('dataPrint.destroy');
        });
    });
    describe('LoticUser: with Permissions', () => {
        let token;

        beforeAll(async () => {
            const usr = await factory.create('LoticUser');
            await usr.addPermissions([
                'dataPrint.list',
                'dataPrint.read',
                'dataPrint.create',
                'dataPrint.update',
                'dataPrint.destroy',
            ]);
            token = await usr.token();
        });

        test('should list', async () => {
            const res = await query(LIST, undefined, token);

            expect(res.body.data.dataPrints).toBeDefined();
            expect(res.body.data.dataPrints.length).toBeDefined();
            expect(res.body.errors).toBeUndefined();
        });
        test('should read', async () => {
            const res = await query(READ, { id: record.id }, token);

            expect(res.body.data.dataPrint).toBeDefined();
            expect(res.body.data.dataPrint.id).toEqual(record.id);
            expect(res.body.data.dataPrint.patient.id).toBeDefined();
            expect(res.body.errors).toBeUndefined();
        });
        test('should create', async () => {
            const attrs = await factory.attrs('DataPrint');
            const variables = {
                dataPrint: attrs
            }
            const res = await mutate(CREATE, variables, token);

            expect(res.body.data.createDataPrint).toBeDefined();
            expect(res.body.errors).toBeUndefined();

            const found = await db.DataPrint.findByPk(res.body.data.createDataPrint.id);
            expect(found).toBeDefined();
        });
        test('should update', async () => {
            const variables = {
                dataPrint: {
                    id: record.id,
                    svg: 'svg_upd',
                }
            }
            const res = await mutate(UPDATE, variables, token);

            expect(res.body.data.updateDataPrint).toBeDefined();
            expect(res.body.data.updateDataPrint.svg).toEqual('svg_upd');
            expect(res.body.errors).toBeUndefined();
        });
        test('should destroy', async () => {
            const destroy = await factory.create('DataPrint');

            const variables = {
                dataPrint: {
                    id: destroy.id,
                }
            }
            const res = await mutate(DESTROY, variables, token);

            expect(res.body.data.destroyDataPrint).toBeDefined();
            expect(res.body.errors).toBeUndefined();

            const found = await db.DataPrint.findByPk(res.body.data.destroyDataPrint.id);
            expect(found).toBeNull();
        });
    });
    describe('Clinician: with Permissions', () => {
        let token;

        beforeAll(async () => {
            const usr = await factory.create('Clinician');
            await usr.addPermissions([
                'dataPrint.list',
                'dataPrint.read',
                'dataPrint.create',
                'dataPrint.update',
                'dataPrint.destroy',
            ]);
            token = await usr.token();
        });

        test('should list', async () => {
            const res = await query(LIST, undefined, token);

            expect(res.body.data.dataPrints).toBeDefined();
            expect(res.body.data.dataPrints.length).toBeDefined();
            expect(res.body.errors).toBeUndefined();
        });
        test('should read', async () => {
            const res = await query(READ, { id: record.id }, token);

            expect(res.body.data.dataPrint).toBeDefined();
            expect(res.body.data.dataPrint.id).toEqual(record.id);
            expect(res.body.data.dataPrint.patient.id).toBeDefined();
            expect(res.body.errors).toBeUndefined();
        });
        test('should create', async () => {
            const attrs = await factory.attrs('DataPrint');
            const variables = {
                dataPrint: attrs
            }
            const res = await mutate(CREATE, variables, token);

            expect(res.body.data.createDataPrint).toBeDefined();
            expect(res.body.errors).toBeUndefined();

            const found = await db.DataPrint.findByPk(res.body.data.createDataPrint.id);
            expect(found).toBeDefined();
        });
        test('should update', async () => {
            const variables = {
                dataPrint: {
                    id: record.id,
                    svg: 'svg_upd',
                }
            }
            const res = await mutate(UPDATE, variables, token);

            expect(res.body.data.updateDataPrint).toBeDefined();
            expect(res.body.data.updateDataPrint.svg).toEqual('svg_upd');
            expect(res.body.errors).toBeUndefined();
        });
        test('should destroy', async () => {
            const destroy = await factory.create('DataPrint');

            const variables = {
                dataPrint: {
                    id: destroy.id,
                }
            }

            const res = await mutate(DESTROY, variables, token);

            expect(res.body.data.destroyDataPrint).toBeDefined();
            expect(res.body.errors).toBeUndefined();

            const found = await db.DataPrint.findByPk(res.body.data.destroyDataPrint.id);
            expect(found).toBeNull();
        });
    });
    describe('Patient: with Permissions', () => {
        let token;

        beforeAll(async () => {
            const usr = await factory.create('Patient');
            await usr.addPermissions([
                'dataPrint.list',
                'dataPrint.read',
                'dataPrint.create',
                'dataPrint.update',
                'dataPrint.destroy',
            ]);
            token = await usr.token();
        });

        test('should list', async () => {
            const res = await query(LIST, undefined, token);

            expect(res.body.data.dataPrints).toBeDefined();
            expect(res.body.data.dataPrints.length).toBeDefined();
            expect(res.body.errors).toBeUndefined();
        });
        test('should read', async () => {
            const res = await query(READ, { id: record.id }, token);

            expect(res.body.data.dataPrint).toBeDefined();
            expect(res.body.data.dataPrint.id).toEqual(record.id);
            expect(res.body.data.dataPrint.patient.id).toBeDefined();
            expect(res.body.errors).toBeUndefined();
        });
        test('should create', async () => {
            const attrs = await factory.attrs('DataPrint');
            const variables = {
                dataPrint: attrs
            }
            const res = await mutate(CREATE, variables, token);

            expect(res.body.data.createDataPrint).toBeDefined();
            expect(res.body.errors).toBeUndefined();

            const found = await db.DataPrint.findByPk(res.body.data.createDataPrint.id);
            expect(found).toBeDefined();
        });
        test('should update', async () => {
            const variables = {
                dataPrint: {
                    id: record.id,
                    svg: 'svg_upd',
                }
            }
            const res = await mutate(UPDATE, variables, token);

            expect(res.body.data.updateDataPrint).toBeDefined();
            expect(res.body.data.updateDataPrint.svg).toEqual('svg_upd');
            expect(res.body.errors).toBeUndefined();
        });
        test('should destroy', async () => {
            const destroy = await factory.create('DataPrint');

            const variables = {
                dataPrint: {
                    id: destroy.id,
                }
            }

            const res = await mutate(DESTROY, variables, token);

            expect(res.body.data.destroyDataPrint).toBeDefined();
            expect(res.body.errors).toBeUndefined();

            const found = await db.DataPrint.findByPk(res.body.data.destroyDataPrint.id);
            expect(found).toBeNull();
        });
    });
});