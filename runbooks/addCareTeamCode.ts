#!/usr/bin/env ts-node-script
import db from '../models';

const run = async () => {
  try {
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1);
    const options = {
      clinicianId: 1,
      code: 'WX123',
      patientName: 'Pat Name',
      method: 'email',
      deliveryAddress: 'goodemail@example.com',
      expiry,
    };

    await db.CareTeamCode.create(options);

    console.log(`DONE`);
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

run();
