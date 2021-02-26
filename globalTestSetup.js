// optional: configure or set up a testing framework before each test
// if you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`
const { init } = require('jasmine-fail-fast');
const db = require('./models').default;

if (process.argv.includes('--bail')) {
  const jasmineEnv = jasmine.getEnv();
  jasmineEnv.addReporter(init());
}

beforeAll(async (done) => {
  await db.sequelize.sync({ force: true });
  global.listener = require('./server').default;
  done();
});

afterAll(async (done) => {
  await db.sequelize.close();
  done();
});
