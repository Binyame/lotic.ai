#!/usr/bin/env ts-node-script
import args from 'args';
import DB from '../models';

const run = async (username) => {
  console.log(`Adding Permissions to ${username}`);
  const userModel = await DB.LoticUser.findOne({
    where: {
      providerId: username,
    },
  });

  await userModel.makeSuper();
  console.log(`DONE`);
  process.exit(0);
};

// Process arguments from the command line
args.option('username', 'The Lotic Username to add super user permissions');
const flags = args.parse(process.argv);

//Run primary function
//Note:  will probably hang and not return unless process.exit called
run(flags.username);

// must export something for isolated modules
export default run;
