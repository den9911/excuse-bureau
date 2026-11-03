import {test} from 'node:test';import assert from 'node:assert/strict';
import {localDate,documentDate} from '../public/papers/document-date.js';
test('chosen calendar dates survive without conversion through a timezone',()=>{
 assert.equal(documentDate('2020-02-02','2026-11-03'),'2020-02-02');
 assert.equal(documentDate('2024-02-29','2026-11-03'),'2024-02-29');
 for(const value of ['2023-02-29','2026-13-01','',null,{},'2026-01-01T01:00:00Z'])assert.equal(documentDate(value,'2026-11-03'),'2026-11-03');
 assert.equal(localDate(new Date(2026,0,1,0,1)),'2026-01-01');
});
