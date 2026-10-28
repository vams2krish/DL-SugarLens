import {test} from 'node:test';
import assert from 'node:assert/strict';
import {foods,candidates,servingSugar} from '../src/foods.js';
test('sugar scales by edible serving mass',()=>{assert.equal(servingSugar(12.2,200),24.4);for(const n of [NaN,0,-1,5001])assert.equal(servingSugar(10,n),null)});
test('recognition only offers supported, sufficiently confident exact labels',()=>{assert.equal(candidates([{className:'banana',probability:.8}])[0].name,'Banana');assert.equal(candidates([{className:'banana',probability:.05}]).length,0);assert.equal(candidates([{className:'banana bread',probability:.9}]).length,0);assert.equal(candidates([{className:'sports car',probability:.9}]).length,0)});
test('reference records have valid sugar percentages and source IDs',()=>{assert.equal(new Set(foods.map(f=>f.fdc)).size,foods.length);assert(foods.every(f=>f.sugar>=0&&f.sugar<=100&&/^\d+$/.test(f.fdc)))});

