import Promise from 'promise';
import bodyParser from 'body-parser';
import MemoryStore from './sessions/memory';
import handleMessages from './message-handler';
import {runQuery, runMutation} from './runner';
import responseDiff from './response-diff';

const jsonBody = bodyParser.json();
export function createMiddleware(
  schema: Object,
  sessionStore: {
    getCache: Function,
    setCache: Function,
    getQuery: Function,
    setQuery: Function,
  },
  getContext: Function
): Function {
  const reqHandler = requestHandler(schema, sessionStore || new MemoryStore());
  function processRequest(req, res, next) {
    Promise.resolve(getContext(req)).then(
      context => reqHandler(req.body.sessionID, context, req.body.requests)
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

export function requestHandler(
  schema: Object,
  sessionStore: {
    getCache: Function,
    setCache: Function,
    getQuery: Function,
    setQuery: Function,
  }
) {
  return (sessionID: string, context: any, requests: Array<Object>) => {
    if (typeof sessionID !== 'string') {
      throw new Error('Expected sessionID to be a string but got ' + typeof sessionID);
    }
    return handleMessages(
      requests,
      sessionID,
      sessionStore,
      mutation => runMutation(mutation, schema, context),
    ).then(result => {
      if (result.expiredSession) return {expiredSession: true};
      return runQuery(result.query, schema, context).then(
        response => responseDiff(response, sessionID, sessionStore),
      ).then(
        data => ({data, expiredSession: false, newSession: result.newSession}),
      );
    });
  };
}