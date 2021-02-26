#!/usr/bin/env ts-node-script
// import args from 'args';
import UserService from '../services/user';
import args from 'args';

const run = async (email, password) => {
  try {
    const providerId = email || 'doc@example.com';
    const providerKey = password || 'Password1234!';
    console.log(`Creating demo clinician ${providerId}:${providerKey}`);

    const service = new UserService({
      provider: 'clinician',
      providerId,
      providerKey,
    });

    await service.upsertUser();

    console.log(`DONE`);
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

// Process arguments from the command line
args.option('email', 'The Clinician Email');
args.option('password', 'The Clinician Password');

const flags = args.parse(process.argv);
//Run primary function
//Note:  will probably hang and not return unless process.exit called
run(flags.email, flags.password);

// must export something for isolated modules
export default run;
