import {test} from 'node:test';
import assert from 'node:assert/strict';
import {foods,candidates,detectedFoods,servingSugar} from '../src/foods.js';
import {portionSummary,csvReport} from '../src/portions.js';
import fs from 'node:fs';
test('sugar scales by edible serving mass',()=>{assert.equal(servingSugar(12.2,200),24.4);for(const n of [NaN,0,0.5,-1,5001])assert.equal(servingSugar(10,n),null)});
test('recognition only offers supported, sufficiently confident exact labels',()=>{assert.equal(candidates([{className:'banana',probability:.8}])[0].name,'Banana');assert.equal(candidates([{className:'banana',probability:.05}]).length,0);assert.equal(candidates([{className:'banana bread',probability:.9}]).length,0);assert.equal(candidates([{className:'sports car',probability:.9}]).length,0)});
test('reference records have valid sugar percentages and source IDs',()=>{assert.equal(new Set(foods.map(f=>f.fdc)).size,foods.length);assert(foods.every(f=>f.sugar>=0&&f.sugar<=100&&/^\d+$/.test(f.fdc)))});

test('detector keeps individual supported objects and excludes weak/non-food matches',()=>{const matches=detectedFoods([{class:'banana',score:.9,bbox:[0,0,10,10]},{class:'banana',score:.8,bbox:[50,0,10,10]},{class:'apple',score:.2},{class:'person',score:.99}]);assert.equal(matches.length,2);assert(matches.every(m=>m.name==='Banana'&&m.bbox.length===4));});
test('combined portions use mass-weighted sugar, not summed percentages',()=>{const list=[{fdc:'173944',grams:200},{fdc:'167762',grams:100}];const result=portionSummary(list);assert.equal(result.grams,300);assert(Math.abs(result.sugar-29.29)<.0001);assert(Math.abs(result.percentage-9.763333333)<.0001);assert(csvReport(list).includes('Banana,200,24.40,173944'));assert.equal(portionSummary([{fdc:'unknown',grams:100},{fdc:'173944',grams:-10}]).rows.length,0);});
test('all nutrition values match their reviewed USDA API snapshots',()=>{const records=['docs/usda-reference-snapshot.json','docs/usda-roadmap-snapshot.json'].flatMap(path=>JSON.parse(fs.readFileSync(path,'utf8')).foods);assert.equal(foods.length,28);for(const food of foods)assert.equal(food.sugar,records.find(record=>String(record.fdcId)===food.fdc)?.sugar,food.name);});

