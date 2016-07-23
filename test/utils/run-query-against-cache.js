import assert from 'assert';
import test from 'testit';
import freeze from 'bicycle/utils/freeze';
import runQueryAgainstCache from 'bicycle/utils/run-query-against-cache';
import {ERROR} from 'bicycle/constants';

test('run-query-against-cache.js', () => {
  test('returns the result of running the query', () => {
    const cache = freeze({foo: {a: 10, b: 20}, root: {items: ['foo']}});
    assert.deepEqual(
      runQueryAgainstCache(
        cache,
        cache.root,
        {items: {a: true, b: true}},
      ),
      {
        result: {items: [{a: 10, b: 20}]},
        loaded: true,
        errors: [],
        errorDetails: [],
      },
    );
  });
  test('returns partial result if still loading', () => {
    const errA = {_type: 'ERROR', value: 'A sample error'};
    const errB = {_type: 'ERROR', value: 'A sample error'};
    const cache = freeze({foo: {a: 10, b: errA, c: errB}, root: {items: ['foo']}});
    assert.deepEqual(
      runQueryAgainstCache(
        cache,
        cache.root,
        {items: {a: true, b: true, c: true}},
      ),
      {
        result: {items: [{a: 10, b: errA, c: errB}]},
        loaded: true,
        errors: [errA.value],
        errorDetails: [errA, errB],
      },
    );
  });
});