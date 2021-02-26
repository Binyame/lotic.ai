import bcrypt from 'bcrypt';

const saltRounds = 10;

export function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(hash);
      }
    });
  });
}

export function comparePassword(password, hash) {
  return new Promise((resolve) => {
    bcrypt.compare(password, hash, (err, res) => {
      if (err) {
        return resolve(false);
      } else {
        return resolve(!!res);
      }
    });
  });
}
