import Q from '../types/Query';
import {OptimisticUpdateHandler} from '../client/optimistic';

const stringify: (value: any) => string = require('stable-stringify');

export {stringify};
export {Q};

export function merge(a: Q, b: Q): Q {
  const result = {};
  for (const key in a) {
    result[key] = a[key];
  }
  for (const key in b) {
    const bVal = b[key];
    if (bVal === true || !result[key]) {
      result[key] = bVal;
    } else {
      result[key] = merge(result[key], bVal);
    }
  }
  return result;
}
export function addField(query: Q, field: string, subQuery: true | Q): Q {
  const result = {};
  for (const key in query) {
    result[key] = query[key];
  }
  if (subQuery === true || !result[field]) {
    result[field] = subQuery;
  } else {
    result[field] = merge(result[field], subQuery);
  }
  return result;
}

export abstract class BaseQuery<TResult> {
  readonly _query: Q;
  /**
   * Usage:
   *   type Result = typeof Query.$type;
   */
  public readonly $type: TResult;
  constructor(query: Q) {
    this._query = query;
    this.$type = null as any;
  }
}

export abstract class BaseRootQuery<TResult> extends BaseQuery<TResult> {
  protected _root: true = true;
}

export class Mutation<TResult> {
  readonly _name: string;
  readonly _args: any;
  readonly _optimisticUpdate: OptimisticUpdateHandler | void;
  /**
   * Usage:
   *   type Result = typeof Mutation.$type;
   */
  public readonly $type: TResult;
  constructor(
    name: string,
    args: any,
    optimisticUpdate: OptimisticUpdateHandler | void,
  ) {
    this._name = name;
    this._args = args;
    this._optimisticUpdate = optimisticUpdate;
    this.$type = null as any;
  }
}

/**
 * Usage:
 *
 *     type TResult = typeof getType(query);
 *
 * @param query A bicycle query
 */
function getType<TResult>(query: BaseQuery<TResult>): TResult;
function getType<TResult>(query: Mutation<TResult>): TResult;
function getType<TResult>(
  query: (...args: any[]) => Mutation<TResult>,
): TResult;
function getType<TResult>(
  query:
    | BaseQuery<TResult>
    | Mutation<TResult>
    | ((...args: any[]) => Mutation<TResult>),
): TResult {
  return null as any;
}
export {getType};
