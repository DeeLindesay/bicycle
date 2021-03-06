# Changelog

## v4.5.0: 2017-12-05

* Only show timing to the nearest millisecond, but still use nanoseconds in the
  background
* Add an optimisation that helps avoid querying the same data twice

## v4.4.0: 2017-12-04

* Time to the nanosecond when `--monitor-bicycle-performance` is passed

## v4.3.0: 2017-11-12

* Pass `fieldName` as part of query context for `resolve` field methods.

## v4.2.2: 2017-11-11

* Fix `isCached` which sometimes incorrectly reported values as being cached,
  leading to them never loading.

## v4.2.1: 2017-11-11

* Cast `undefined` fields to `null`. We use `undefined` to represent "not yet
  loaded".

## v4.2.0: 2017-10-23

* Expose `QueryCacheResult` interface on `client` module

## v4.1.0: 2017-10-20

* Inspect queries when an invalid query happens in merge in development.

## v4.0.1: 2017-10-03

* Fix broken publish

## v4.0.0: 2017-08-05

* Optimistic values are now strings. They still get replaced once the true
  values are discovered.
* Optimistic handlers are now given a mutable Cache Object. This means they
  always have the same API wheather they are typed (using ts-bicycle) or not.

## v3.1.5: 2017-08-05

* Fix broken queries (I forgot to run the tests)

## v3.1.4: 2017-08-05

* Fix server side rendering with typescript

## v3.1.3: 2017-08-04

* Fix one broken overload of server renderer

## v3.1.2: 2017-08-04

* All server methods can have getContext return a Promise for context, as well
  as returning the context directly. This lets you setup database connections
  asynchronously, before returning a context.

## v3.1.1: 2017-08-04

* Moved some of the typed helpers and added some new ones

## v3.1.0: 2017-08-04

* Pass context to ID getter
* Add helpers for typed code

## v3.0.1: 2017-08-03

* Preserve const enums for non typescript consumers

## v3.0.0: 2017-08-03

Convert to typescript

### Breaking:

* Scalars `validate` method now has to return a boolean indicating whether the
  value is valid, and requires a "baseType".
* Scalars can no longer have `parse` and `validate`.
* The cache format, used by optimistic updaters, is now `{[typeName: string]:
  {[id: string]: Node}}` where it used to be `{[typeName + ':' + id]: Node}`.
  This is to allow for strongly typed bicycle caches.
* Void and Null are now treated as different, distinct values.
* The empty object is no longer cast to undefined for mutation arguments
* `createServerRenderer` now expects a `getContext` argument and then takes
  `Request` instead of `Context`

### Features:

* You can optionally add an `auth` property to each mutation/field. It is called
  with the same arguments as `resolve` and returns `true`, `false` (or a Promise
  for `true` or `false`) to idicate whether the current context is authorized to
  perform that action.
* Args do not have to be objects, you an direclty use e.g. `number` now.

## v1.0.0: 2017-05-01

* Replace server side API with something a bit more Object Orientated. You now
  construct a `BicycleServer` api. There is no longer a separate `loadSchema`
  function. This saves repeatedly needing to pass `schem` to everything.
* Add the ability to log at the beginning and end of queries and mutations. It
  will also pause to wait for any promises returned by the logging functions,
  which allows you to use them for cache invalidation.
