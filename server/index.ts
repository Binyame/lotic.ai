if (process.env.NODE_ENV !== 'production') {
  require('dotenv-safe').config({
    allowEmptyValues: true,
  });
}

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import compression from 'compression';
import cors from 'cors';
import bodyParser from 'body-parser';

import { useAuthentication } from '../authentication';

import schema from '../graphql/schema';
import context from '../graphql/context';

import config from '../config/config';
import { attachStreamVideoRoutes } from './routes/streamVideo';

const endpoint = `${config.api.host}/graphql`;

const app = express();

app.use('*', cors());
app.use(compression());
app.use(bodyParser.json());

useAuthentication(app);

//REST ROUTES
attachStreamVideoRoutes(app);

const server = new ApolloServer({
  schema,
  context,
  validationRules: [depthLimit(7)],
  introspection: true,
  playground: {
    settings: {
      'editor.theme': 'dark',
    },
    tabs: [
      {
        endpoint,
        query: `{\n  helloWorld\n}`,
      },
    ],
  },
  // LOGGING EXAMPLE
  // plugins: [
  //   {
  //     requestDidStart(requestContext) {
  //       // console.log(requestContext);

  //       return {
  //         parsingDidStart(reqCon) {
  //           console.log(reqCon.request);
  //         }
  //       }
  //     }
  //   }
  // ]
});

server.applyMiddleware({ app, path: '/graphql' });

if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`🚀  GraphQL is now running on ${endpoint}`);
  });
}

export default app;
