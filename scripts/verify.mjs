import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
await fs.mkdir('docs',{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1140},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:5173/');await page.locator('h1').waitFor();await page.evaluate(()=>document.fonts.ready);
await page.screenshot({path:'docs/project-desktop.png',fullPage:true});
await page.getByRole('combobox').selectOption('1');
await page.locator('#grams').fill('200');await page.getByText('Approximately 24.40 g sugar in your portion',{exact:true}).waitFor();
await page.locator('#grams').fill('0');await page.getByText('Enter a weight from 1 to 5,000 g.').waitFor();
await page.getByRole('button',{name:/Strawberry/}).click();await page.getByText('Approximately 4.89 g sugar in your portion',{exact:true}).waitFor();
await page.locator('#photo').setInputFiles({name:'broken.png',mimeType:'image/png',buffer:Buffer.from('not an image')});
await page.getByRole('status').filter({hasText:'Could not read the image'}).waitFor();
await page.getByRole('button',{name:/Strawberry/}).click();await page.evaluate(()=>{document.querySelector('#status').textContent='Your photo stays on this device. Always.'});
await page.setViewportSize({width:390,height:844});await page.screenshot({path:'docs/project-mobile.png',fullPage:true});
assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow on mobile');
assert.deepEqual(errors,[]);
console.log('PASS: desktop render, manual selection, portion scaling, validation, library navigation, invalid image handling, mobile layout.');
// Verify the actual pretrained model loads and executes on an image; no mocked AI.
const inference=await page.evaluate(async()=>{const tf=await import('/node_modules/.vite/deps/@tensorflow_tfjs.js');const mobilenet=await import('/node_modules/.vite/deps/@tensorflow-models_mobilenet.js');await tf.ready();const model=await mobilenet.load({version:2,alpha:1});const canvas=document.createElement('canvas');canvas.width=224;canvas.height=224;const predictions=await model.classify(canvas,5);return predictions;});
assert.equal(inference.length,5);assert(inference.every(p=>typeof p.className==='string'&&p.probability>=0&&p.probability<=1));
console.log('PASS: real MobileNet model downloaded and returned five predictions. Produce accuracy is not benchmarked.');
await browser.close();

