import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/manrope/latin-800.css';
import './style.css';
import {foods,candidates,detectedFoods,servingSugar} from './foods.js';
import {portionSummary,csvReport} from './portions.js';

const $=selector=>document.querySelector(selector);
const emptyResult=`<div class="result-empty"><div class="fruit-art">🍐<span>🍊</span></div><h2>Good food. Better understood.</h2><p>Your produce's sugar profile will appear here.<br>Start with a photo or pick from the list.</p></div>`;
$('#app').innerHTML=`
 <header><a class="brand" href="./"><span class="brand-icon">◉</span> SugarLens<span class="brand-dot">.</span></a><nav><a href="#scanner">Scan produce</a><a href="#library">Food library</a><a href="#offline">Offline tools</a></nav><span class="privacy" id="connection">◌ On-device & private</span></header>
 <div id="update-banner" class="banner" hidden>A new version is ready. <button id="update-app">Update app</button> <small>Your portion list will be kept in this tab.</small></div>
 <main><section class="intro"><div class="eyebrow">A FRESH PERSPECTIVE ON EVERY BITE</div><h1>Know your fruit.<br><em>Understand your sugar.</em></h1><p>Snap a single fruit or a few fresh favorites. Confirm what you see,<br class="desktop"> explore natural sugar, and build your own portion comparison.</p><button class="secondary" id="demo">Try a real photo demo ↗</button><a class="demo-credit" href="./demo/ATTRIBUTION.md" target="_blank" rel="noopener">Photo: Evan-Amos · CC BY-SA 3.0</a></section>
 <section class="workspace" id="scanner"><article class="scan-card"><div class="card-heading"><span><b class="step">01</b> Meet your produce</span><span class="tag">PRIVATE PHOTO SCAN</span></div>
 <fieldset class="modes"><legend>Recognition mode</legend><label><input type="radio" name="mode" value="single" checked> One produce</label><label><input type="radio" name="mode" value="multiple"> Multiple items</label></fieldset><p class="hint" id="mode-help">Single-produce recognition supports 12 produce categories.</p>
 <label class="upload" id="drop"><input type="file" id="photo" aria-label="Choose a produce photo" accept="image/jpeg,image/png,image/webp"><div id="upload-content"><div class="scan-symbol">⌗</div><h2>Something fresh? Let's see.</h2><p>Choose a photo or drop one here</p><span class="button">＋ Choose a photo</span><small>JPG, PNG or WebP · Up to 12 MB</small></div><canvas id="preview" role="img" aria-label="Your selected produce" hidden></canvas></label>
 <div class="photo-actions"><button class="secondary" id="camera-button">Take a photo</button><input type="file" id="camera" aria-label="Take a produce photo" accept="image/*" capture="environment" hidden><button class="text-button" id="rescan" hidden>Scan in selected mode</button><button class="text-button" id="reset">Clear photo</button></div>
 <p id="status" role="status" aria-live="polite">Your photo stays on this device. Always.</p><div id="suggestions" aria-label="Produce suggestions"></div>
 <div class="divider"><span>or explore without a photo</span></div><label class="field-label" for="food">Choose your fruit or vegetable</label><select id="food"><option value="">Select produce…</option>${foods.map((f,i)=>`<option value="${i}">${f.emoji} ${f.name}</option>`).join('')}</select></article>
 <article class="result-card"><div class="card-heading"><span><b class="step">02</b> A little food insight</span><span class="tag">REFERENCE ESTIMATE</span></div><div id="result">${emptyResult}</div><div class="note"><span>ⓘ</span><p>A photo identifies food, not sugar concentration or portion weight. Values are raw-food reference averages. Confirm the food and enter the edible weight.</p></div></article></section>
 <section class="comparison" id="comparison"><div class="section-title"><div><div class="eyebrow">YOUR PORTION LIST</div><h2>A little of this, a little of that.</h2></div><button class="text-button" id="clear-portions">Clear list</button></div><p class="hint">Add confirmed foods with their weighed portions. This list stays in this browser tab; photos are never stored.</p><div id="portion-list"></div><div id="total" aria-live="polite"></div><button class="secondary" id="export" disabled>Download CSV</button><p id="portion-message" class="hint" role="status"></p></section>
 <section class="library" id="library"><div class="section-title"><div><div class="eyebrow">THE FRESH FILES</div><h2>Explore ${foods.length} fresh favorites</h2></div><span>Natural sugars · per 100 g</span></div><div class="library-tools"><label>Find produce<input type="search" id="search" placeholder="Try blueberry, spinach…"></label><label>Sort by<select id="sort"><option value="name">Name A–Z</option><option value="sugar">Sugar: low to high</option></select></label></div><p id="library-count" class="hint" aria-live="polite"></p><div class="food-grid" id="food-grid"></div><button class="text-button" id="show-all">Show all ${foods.length} foods</button></section>
 <section class="offline-panel" id="offline"><div><div class="eyebrow">READY WHEN YOU ARE</div><h2>Take your food curiosity offline.</h2><p>Download both recognition models to this device. The app and food library are saved automatically after the first online visit.</p><p class="hint">Models use roughly 40 MB plus the app. Your browser may reclaim storage; check saved status before travelling.</p></div><div class="offline-controls"><button class="button" id="download-models">Download models</button><button class="text-button" id="check-models">Check saved models</button><button class="text-button" id="remove-models">Remove saved models</button><p id="model-status" role="status" aria-live="polite">Models have not been checked on this device.</p><p id="app-cache-status" class="hint">Offline app shell requires an HTTPS installation.</p></div></section>
 <section id="about" class="about"><div><span>◈</span><h3>Deep learning, on your device</h3><p>MobileNet identifies single produce. COCO-SSD locates apples, bananas, oranges, broccoli and carrots in multi-item photos.</p></div><div><span>◎</span><h3>Simple, transparent numbers</h3><p>10 g sugar per 100 g means 10% by weight. Mixed portions use a weight-based average, never a sum of percentages.</p></div><div><span>♧</span><h3>Made for everyday curiosity</h3><p>Every food links to a reviewed USDA reference. Estimates vary with ripeness and variety and are not medical advice.</p><button class="text-button" id="install">How to install on your phone ↗</button><p id="install-help" class="hint" hidden>iPhone: Safari → Share → Add to Home Screen. Android: Chrome menu → Install app / Add to Home screen.</p></div></section></main>
 <footer><a class="brand" href="./">SugarLens.</a><span>A little more awareness. A little more balance.</span><span>Version 1.1 · Built with curiosity & science</span></footer>`;

let mode='single',busy=false,photoCanvas=null,selected=null,showAll=false;
let portions=[];
try{const saved=JSON.parse(sessionStorage.getItem('sugarlens-portions')||'[]');if(Array.isArray(saved))portions=portionSummary(saved.slice(0,100)).rows.map(({fdc,grams})=>({fdc,grams}));}catch{/* Disabled browser storage is supported. */}
const status=message=>{$('#status').textContent=message};
function setBusy(value){busy=value;for(const id of ['photo','camera','camera-button','demo','rescan','reset','download-models','remove-models','check-models'])$('#'+id).disabled=value;document.querySelectorAll('[name="mode"]').forEach(input=>{input.disabled=value});$('#drop').classList.toggle('working',value);}
function clearResult(){selected=null;$('#food').value='';$('#result').innerHTML=emptyResult;}
function showFood(index){
 const food=foods[index];if(!food)return;selected=food;$('#food').value=String(index);
 $('#result').innerHTML=`<div class="selected-food"><span>${food.emoji}</span><div><small>RAW · EDIBLE PORTION</small><h2>${food.name}</h2></div></div><div class="sugar-number">${food.sugar.toFixed(2)}<span>%</span></div><p class="sugar-caption">total natural sugar by weight</p><div class="meter"><div style="width:${Math.min(100,food.sugar/20*100)}%"></div></div><div class="meter-label"><span>${food.sugar.toFixed(2)} g sugar / 100 g</span><span>Reference average</span></div><div class="portion"><label for="grams">Your edible portion <small>(grams)</small></label><input id="grams" type="number" min="1" max="5000" step="any" inputmode="decimal" value="100"><p id="portion-result" aria-live="polite"></p></div><button class="button" id="add-portion">Add portion to list</button><a class="source" href="https://fdc.nal.usda.gov/food-details/${food.fdc}/nutrients" target="_blank" rel="noopener">USDA FoodData Central · View source ↗</a>`;
 function update(){const amount=servingSugar(food.sugar,$('#grams').valueAsNumber);$('#portion-result').textContent=amount===null?'Enter a weight from 1 to 5,000 g.':`Approximately ${amount.toFixed(2)} g sugar in your portion`;$('#add-portion').disabled=amount===null;}
 $('#grams').addEventListener('input',update);update();
 $('#add-portion').onclick=()=>{
  if(servingSugar(food.sugar,$('#grams').valueAsNumber)===null)return;
  if(portions.length>=100){$('#portion-message').textContent='This list holds up to 100 portions. Remove a portion before adding another.';return;}
  portions.push({fdc:food.fdc,grams:$('#grams').valueAsNumber});renderPortions();$('#portion-message').textContent=`Added ${food.name} to your portion list.`;
 };
}
function renderPortions(){
 const summary=portionSummary(portions);$('#portion-list').replaceChildren();
 for(const [index,row] of summary.rows.entries()){
  const div=document.createElement('div');div.className='portion-row';
  const info=document.createElement('span');info.textContent=`${row.name} · ${row.grams} g edible weight · ${row.sugar.toFixed(2)} g sugar`;
  const remove=document.createElement('button');remove.className='text-button';remove.textContent='Remove';remove.setAttribute('aria-label',`Remove ${row.name} portion ${index+1}`);remove.onclick=()=>{portions.splice(index,1);renderPortions()};
  div.append(info,remove);$('#portion-list').append(div);
 }
 $('#total').textContent=summary.rows.length?`${summary.grams.toFixed(1)} g food · approximately ${summary.sugar.toFixed(2)} g total sugar · ${summary.percentage.toFixed(2)}% by weight`:'Your list is empty. Choose a food and add a weighed portion.';
 $('#export').disabled=!summary.rows.length;$('#clear-portions').disabled=!summary.rows.length;
 try{sessionStorage.setItem('sugarlens-portions',JSON.stringify(portions));}catch{$('#portion-message').textContent='Tab storage is unavailable. This list will clear on reload.';}
}
function renderLibrary(){
 const query=$('#search').value.trim().toLowerCase();const filtered=foods.filter(f=>f.name.toLowerCase().includes(query)).sort((a,b)=>$('#sort').value==='sugar'?a.sugar-b.sugar:a.name.localeCompare(b.name));
 const shown=showAll||query?filtered:filtered.slice(0,8);$('#food-grid').replaceChildren();
 for(const food of shown){const button=document.createElement('button');button.className='food-tile';button.innerHTML=`<span class="food-emoji">${food.emoji}</span><b>${food.name}</b><span>${food.sugar.toFixed(2)}<small> g sugar</small></span><span class="tile-arrow">↗</span>`;button.onclick=()=>{showFood(foods.indexOf(food));$('#scanner').scrollIntoView({behavior:'smooth'});};$('#food-grid').append(button);}
 $('#library-count').textContent=filtered.length?`Showing ${shown.length} of ${filtered.length} foods`:'No matching produce. Try another name.';
 $('#show-all').hidden=Boolean(query)||filtered.length<=8;$('#show-all').textContent=showAll?'Show fewer foods':`Show all ${foods.length} foods`;
}
async function decodeImage(file){
 if(file.size>12*1024*1024)throw Error('Please choose an image under 12 MB.');
 if(!/^image\/(jpeg|png|webp)$/.test(file.type))throw Error('Please choose a JPG, PNG or WebP photo. Convert HEIC photos to JPG first.');
 const url=URL.createObjectURL(file),image=new Image();
 try{image.src=url;await image.decode();if(image.naturalWidth*image.naturalHeight>40_000_000)throw Error('This photo is too large. Choose a photo under 40 megapixels.');const canvas=document.createElement('canvas');const scale=Math.min(1,1280/Math.max(image.naturalWidth,image.naturalHeight));canvas.width=Math.round(image.naturalWidth*scale);canvas.height=Math.round(image.naturalHeight*scale);canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);return canvas;}catch(error){if(error.message.includes('megapixels'))throw error;throw Error('Could not read the image. Try a different JPG, PNG or WebP.');}finally{URL.revokeObjectURL(url);}
}
function drawPhoto(matches=[]){
 const canvas=$('#preview');canvas.width=photoCanvas.width;canvas.height=photoCanvas.height;const ctx=canvas.getContext('2d');ctx.drawImage(photoCanvas,0,0);ctx.lineWidth=Math.max(3,canvas.width/220);ctx.font=`bold ${Math.max(18,canvas.width/35)}px sans-serif`;
 for(const [i,match] of matches.entries())if(match.bbox){const [x,y,w,h]=match.bbox;ctx.strokeStyle='#164d37';ctx.strokeRect(x,y,w,h);const text=`${i+1}. ${match.name}`;const labelWidth=ctx.measureText(text).width+16;const size=Math.max(26,canvas.width/27);const labelY=Math.max(0,y-size);ctx.fillStyle='#164d37';ctx.fillRect(x,labelY,labelWidth,size);ctx.fillStyle='white';ctx.fillText(text,x+8,labelY+size*.75);}
 canvas.hidden=false;canvas.setAttribute('aria-label',`Selected produce photo${matches.length?`, ${matches.length} suggestions`:''}`);$('#upload-content').hidden=true;$('#rescan').hidden=false;
}
async function recognize(){
 const {getModel}=await import('./inference.js');status(`Loading ${mode==='multiple'?'multi-item detector':'single-produce recognition'}…`);
 const model=await getModel(mode);status('Looking at your produce…');
 const matches=mode==='multiple'?detectedFoods(await model.detect(photoCanvas,20,.5)):candidates(await model.classify(photoCanvas,5));
 drawPhoto(matches);$('#suggestions').replaceChildren();
 if(!matches.length){status('No supported produce confidently identified. Try another photo or select the food manually.');return;}
 status(`${matches.length} possible ${matches.length===1?'match':'matches'}. Confirm each food before using its reference value.`);
 for(const [i,food] of matches.entries()){
  const button=document.createElement('button');button.className='suggestion';button.textContent=`${food.bbox?`${i+1}. `:''}${food.emoji} ${food.name} · ${(food.probability*100).toFixed(0)}% model score · Confirm`;
  button.onclick=()=>{showFood(foods.findIndex(f=>f.fdc===food.fdc));status(`Confirmed ${food.name}. Enter its edible portion weight, then add it to your list.`);};$('#suggestions').append(button);
 }
}
async function scan(file){
 if(!file||busy)return;setBusy(true);clearResult();$('#suggestions').replaceChildren();status('Reading your photo…');
 try{photoCanvas=null;$('#preview').hidden=true;$('#upload-content').hidden=false;$('#rescan').hidden=true;photoCanvas=await decodeImage(file);drawPhoto();await recognize();}
 catch(error){status(error.message||'Recognition is unavailable. Please choose produce manually.');}finally{setBusy(false);$('#photo').value='';$('#camera').value='';}
}
$('#food').addEventListener('change',()=>$('#food').value===''?clearResult():showFood(Number($('#food').value)));
$('#photo').addEventListener('change',e=>scan(e.target.files[0]));$('#camera').addEventListener('change',e=>scan(e.target.files[0]));$('#camera-button').onclick=()=>$('#camera').click();
$('#reset').onclick=()=>{photoCanvas=null;$('#preview').hidden=true;$('#upload-content').hidden=false;$('#rescan').hidden=true;$('#suggestions').replaceChildren();clearResult();status('Your photo stays on this device. Always.');};
$('#rescan').onclick=async()=>{if(!photoCanvas||busy)return;setBusy(true);clearResult();$('#suggestions').replaceChildren();try{await recognize();}catch(error){status(error.message)}finally{setBusy(false)}};
document.querySelectorAll('[name="mode"]').forEach(input=>input.addEventListener('change',()=>{mode=input.value;$('#mode-help').textContent=mode==='multiple'?'Multi-item detection supports apples, bananas, oranges, broccoli and carrots. Other objects are ignored.':'Single-produce recognition supports 12 produce categories.';}));
$('#demo').onclick=async()=>{if(busy)return;setBusy(true);status('Opening the demo photograph…');try{const response=await fetch('./demo/banana.jpg');if(!response.ok)throw Error('The demo photo could not load. Please upload your own.');const blob=await response.blob();setBusy(false);await scan(new File([blob],'banana.jpg',{type:'image/jpeg'}));$('#scanner').scrollIntoView({behavior:'smooth'});}catch(error){status(error.message);setBusy(false)}};
const drop=$('#drop');drop.addEventListener('dragover',e=>{e.preventDefault();if(!busy)drop.classList.add('dragging')});drop.addEventListener('dragleave',()=>drop.classList.remove('dragging'));drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('dragging');scan(e.dataTransfer.files[0])});
$('#search').addEventListener('input',renderLibrary);$('#sort').addEventListener('change',renderLibrary);$('#show-all').onclick=()=>{showAll=!showAll;renderLibrary()};
$('#clear-portions').onclick=()=>{portions=[];renderPortions();$('#portion-message').textContent='Portion list cleared.'};
$('#export').onclick=()=>{const url=URL.createObjectURL(new Blob([csvReport(portions)],{type:'text/csv;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='sugarlens-portions.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
async function modelsAction(action){
 if(busy)return;setBusy(true);try{const inference=await import('./inference.js');const state=await(action==='save'?inference.saveModels(message=>{$('#model-status').textContent=message}):action==='remove'?inference.removeModels():inference.modelState());$('#model-status').textContent=`Saved on this device — Single produce: ${state.single?'yes':'no'} · Multiple items: ${state.multiple?'yes':'no'}.`;}catch(error){$('#model-status').textContent=`Model storage unavailable: ${error.message}. Manual lookup still works.`;}finally{setBusy(false)}
}
$('#download-models').onclick=()=>modelsAction('save');$('#check-models').onclick=()=>modelsAction('check');$('#remove-models').onclick=()=>modelsAction('remove');
function connection(){ $('#connection').textContent=navigator.onLine?'◌ On-device & private':'◌ Offline · local mode'; }
addEventListener('online',connection);addEventListener('offline',connection);connection();
let installPrompt;addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;$('#install').textContent='Install SugarLens ↗'});
$('#install').onclick=async()=>{if(installPrompt){await installPrompt.prompt();installPrompt=null;}else $('#install-help').hidden=!$('#install-help').hidden;};
if('serviceWorker' in navigator&&import.meta.env.PROD&&/^https?:$/.test(location.protocol)){
 navigator.serviceWorker.register('./sw.js').then(reg=>{
  navigator.serviceWorker.ready.then(()=>{$('#app-cache-status').textContent='App and food library saved for offline use.'});
  const update=()=>{if(reg.waiting){$('#update-banner').hidden=false;$('#update-app').onclick=()=>{reg.waiting?.postMessage('ACTIVATE_UPDATE');};}};update();reg.addEventListener('updatefound',()=>{reg.installing?.addEventListener('statechange',update)});
  let refreshing=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!refreshing&&navigator.serviceWorker.controller&&!$('#update-banner').hidden){refreshing=true;location.reload();}});
 }).catch(()=>{$('#app-cache-status').textContent='Offline app setup failed. Reconnect and reload to retry.'});
}
renderLibrary();renderPortions();
