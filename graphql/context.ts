import jwt from 'jsonwebtoken';
import config from '../config/config';
import { AuthenticationError } from 'apollo-server-express';
import db from '../models/index';

function getToken(req: any) {
  let token = req.headers.Authorization || req.headers.authorization;

  if (!token) {
    return null;
  }

  token = token.replace('Bearer', '').trim();
  return token;
}

function context({ req, res }: any) {
  // const dataloaderContext = createContext(db.sequelize);

  try {
    const token = getToken(req);

    if (token) {
      jwt.verify(token, config.jwt.secret, { expiresIn: '30d' });
      req.user = jwt.decode(token);
    }
  } catch (e) {
    throw new AuthenticationError('must authenticate');
  }

  return {
    user: req.user,
    req,
    db,
    // dataloaderContext,
  };
}

export default context;
