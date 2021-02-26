#!/usr/bin/env ts-node-script
import args from 'args';
import DB from '../models';
import hashids from '../services/hashids';

const run = async (id) => {
  console.log(`Fetching registration URL for HCProvider with id:${id}`);

  try {
    const hcProvider = await DB.HCProvider.findByPk(id);
    if (!hcProvider) {
      throw new Error(`HCProvider:${id} not found`);
    }

    const hashId = hashids.encode(id);
    console.log(`Registration URL for ${hcProvider.name}:`);
    console.log(`https://provider.lotic.ai/register/${hashId}`);

    console.log(`DONE`);
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

// Process arguments from the command line
args.option('id', 'The HCProvider id');
const flags = args.parse(process.argv);
//Run primary function
//Note:  will probably hang and not return unless process.exit called
run(flags.id);
// must export something for isolated modules
export default run;
