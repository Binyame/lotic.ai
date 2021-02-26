const Hashids = require('hashids/cjs');

const hashLength: number = parseInt(process.env.HASH_ID_LENGTH || '', 10);
const hashids = new Hashids(process.env.HASH_ID_SALT, hashLength);

export default hashids;
