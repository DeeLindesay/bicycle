// @flow

import type {Context, Schema, SessionStore} from './flow-types';
import Promise from 'promise';
import bodyParser from 'body-parser';
import handleMessage from './message-handler';

const jsonBody = bodyParser.json();
export default function createBicycleMiddleware(
  schema: Schema,
  sessionStore: SessionStore,
  getContext: (req: Object, options: {stage: 'query' | 'mutation'}) => Context,
): Function {
  function processRequest(req, res, next) {
    Promise.resolve(null).then(
     () => Promise.all([getContext(req, {stage: 'query'}), getContext(req, {stage: 'mutation'})])
   ).then(
      ([context, mutationContext]) => handleMessage(schema, sessionStore, req.body, context, mutationContext)
    ).done(
      response => res.json(response),
      err => next(err)
    );
  }
  return (req, res, next) => {
    if (req.method !== 'POST') return next();
    if (!req.body) {
      jsonBody(req, res, (err) => {
        if (err) return next(err);
        processRequest(req, res, next);
      });
    } else {
      processRequest(req, res, next);
    }
  };
}
