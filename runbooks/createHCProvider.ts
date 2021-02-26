import args from 'args';
import DB from '../models';
import hashids from '../services/hashids';

const run = async (name) => {
  console.log(`Creating HCProvider: ${name}`);
  try {
    const opts = { name };
    try {
      const newHCProvider = await DB.HCProvider.create(opts);
      const hashId = hashids.encode(newHCProvider.id);
      console.log(`Provider ${name} was created with ID:${newHCProvider.id}`);
      console.log(
        `Clinicians can register for an account at -->  https://provider.lotic.ai/register/${hashId}`
      );
    } catch (e) {
      console.log('e', e);
    }
    console.log('DONE');
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};
// Process arguments from the command line
args.option('name', 'The HCProvider name');
const flags = args.parse(process.argv);
//Run primary function
//Note:  will probably hang and not return unless process.exit called
run(flags.name);
// must export something for isolated modules
export default run;
