import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    addresses {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    address(id: $id) {
      id
      patient {
        id
      }
    }
  }
`;

const CREATE = `
  mutation create($address: AddressCreate) {
    createAddress(address: $address) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($address: AddressUpdate) {
    updateAddress(address: $address) {
      id
      region
    }
  }
`;

const DESTROY = `
  mutation destroy($address: AddressDestroy) {
    destroyAddress(address: $address) {
      id
    }
  }
`;

describe('Integration - Address', () => {
  let record;

  beforeAll(async () => {
    record = await factory.create('Address');
    await factory.create('Address');
    await factory.create('Address');
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);

      expect(res.body.data.addresses).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });

      expect(res.body.data.address).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Address');
      const variables = {
        address: attrs,
      };

      const res = await mutate(CREATE, variables);

      expect(res.body.data.createAddress).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        address: {
          id: record.id,
          region: 'New Region',
        },
      };
      const res = await mutate(UPDATE, variables);

      expect(res.body.data.updateAddress).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Address');

      const variables = {
        address: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables);

      expect(res.body.data.destroyAddress).toBeNull();
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

      expect(res.body.data.addresses).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('address.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.address).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('address.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Address');
      const variables = {
        address: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createAddress).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('address.create');
    });
    test('should NOT update', async () => {
      const variables = {
        address: {
          id: record.id,
          region: 'New Region',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateAddress).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('address.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Address');

      const variables = {
        address: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyAddress).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('address.destroy');
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

      expect(res.body.data.addresses).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('address.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.address).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('address.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Address');
      const variables = {
        address: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createAddress).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('address.create');
    });
    test('should NOT update', async () => {
      const variables = {
        address: {
          id: record.id,
          region: 'New Region',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateAddress).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('address.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Address');

      const variables = {
        address: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyAddress).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('address.destroy');
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

      expect(res.body.data.addresses).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('address.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.address).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('address.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Address');
      const variables = {
        address: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createAddress).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch(
        'Missing permission for address.create'
      );
    });
    test('should NOT update', async () => {
      const variables = {
        address: {
          id: record.id,
          region: 'New Region',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateAddress).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('address.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Address');

      const variables = {
        address: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyAddress).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('address.destroy');
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'address.list',
        'address.read',
        'address.create',
        'address.update',
        'address.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.addresses).toBeDefined();
      expect(res.body.data.addresses.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.address).toBeDefined();
      expect(res.body.data.address.id).toEqual(record.id);
      expect(res.body.data.address.patient.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Address');
      const variables = {
        address: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createAddress).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Address.findByPk(res.body.data.createAddress.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        address: {
          id: record.id,
          region: 'New Region',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateAddress).toBeDefined();
      expect(res.body.data.updateAddress.region).toEqual('New Region');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Address');

      const variables = {
        address: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyAddress).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Address.findByPk(res.body.data.destroyAddress.id);
      expect(found).toBeNull();
    });
  });
  describe('Clinician: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Clinician');
      await usr.addPermissions([
        'address.list',
        'address.read',
        'address.create',
        'address.update',
        'address.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.addresses).toBeDefined();
      expect(res.body.data.addresses.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.address).toBeDefined();
      expect(res.body.data.address.id).toEqual(record.id);
      expect(res.body.data.address.patient.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Address');
      const variables = {
        address: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createAddress).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Address.findByPk(res.body.data.createAddress.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        address: {
          id: record.id,
          region: 'New Region',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateAddress).toBeDefined();
      expect(res.body.data.updateAddress.region).toEqual('New Region');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Address');

      const variables = {
        address: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyAddress).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Address.findByPk(res.body.data.destroyAddress.id);
      expect(found).toBeNull();
    });
  });
  describe('Patient: with Permissions', () => {
    let token;
    let patient;

    beforeAll(async () => {
      patient = await factory.create('Patient');
      await patient.addPermissions([
        'address.list',
        'address.read',
        'address.create',
        'address.update',
        'address.destroy',
      ]);
      token = await patient.token();
    });

    test('should NOT list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.addresses).toEqual([]);
      expect(res.body.errors).toBeUndefined();
    });
    test('should list my own', async () => {
      const record = await factory.create('Address', {
        targetId: patient.id,
      });

      const res = await query(LIST, undefined, token);

      expect(res.body.data.addresses).toBeDefined();
      expect(res.body.data.addresses.length).toEqual(1);
      expect(res.body.data.addresses[0].id).toEqual(record.id);
      expect(res.body.errors).toBeUndefined();
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.address).toEqual(null);
      expect(res.body.errors).toBeUndefined();
    });
    test('should read my own', async () => {
      const record = await factory.create('Address', {
        targetId: patient.id,
      });

      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.address).toBeDefined();
      expect(res.body.data.address.id).toEqual(record.id);
      expect(res.body.data.address.patient.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Address');
      const variables = {
        address: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createAddress).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch(
        'You are not the current patient.'
      );
    });
    test('should create my own', async () => {
      const attrs = await factory.attrs('Address');
      const variables = {
        address: {
          ...attrs,
          targetId: patient.id,
        },
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createAddress).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Address.findByPk(res.body.data.createAddress.id);
      expect(found).toBeDefined();
    });
    test('should NOT update', async () => {
      const variables = {
        address: {
          id: record.id,
          region: 'New Region',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateAddress).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch(
        'You can not modify this entry.'
      );
    });
    test('should update my own', async () => {
      const record = await factory.create('Address', {
        targetId: patient.id,
      });

      const variables = {
        address: {
          id: record.id,
          region: 'New Region',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateAddress).toBeDefined();
      expect(res.body.data.updateAddress.region).toEqual('New Region');
      expect(res.body.errors).toBeUndefined();
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Address');

      const variables = {
        address: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyAddress).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch(
        'You can not destroy this entry.'
      );
    });
    test('should destroy my own', async () => {
      const destroy = await factory.create('Address', {
        targetId: patient.id,
      });

      const variables = {
        address: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyAddress).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Address.findByPk(res.body.data.destroyAddress.id);
      expect(found).toBeNull();
    });
  });
});
