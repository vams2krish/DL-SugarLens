// Versioned IndexedDB models; wrapper internals are covered by the E2E offline test.
const KEYS={single:'indexeddb://sugarlens-mobilenet-v2-1',multiple:'indexeddb://sugarlens-coco-lite-v1'};
let runtimePromise;
const models=new Map();
async function runtime(){
 runtimePromise??=import('@tensorflow/tfjs').then(async tf=>{await tf.ready();return tf;}).catch(error=>{runtimePromise=undefined;throw error});
 return runtimePromise;
}
export async function modelState(){
 const tf=await runtime();const saved=await tf.io.listModels();
 return Object.fromEntries(Object.entries(KEYS).map(([key,url])=>[key,Boolean(saved[url])]));
}
export async function getModel(mode){
 if(!KEYS[mode])throw new Error('Unknown recognition mode.');
 if(!models.has(mode))models.set(mode,(async()=>{
  const tf=await runtime();const saved=await tf.io.listModels().catch(()=>({}));
  async function load(url){
   if(mode==='multiple'){const coco=await import('@tensorflow-models/coco-ssd');return coco.load({base:'lite_mobilenet_v2',...(url?{modelUrl:url}:{})});}
   const mobile=await import('@tensorflow-models/mobilenet');
   return mobile.load({version:2,alpha:1,...(url?{modelUrl:url,inputRange:[0,1]}:{})});
  }
  if(saved[KEYS[mode]]){try{return await load(KEYS[mode]);}catch{await tf.io.removeModel(KEYS[mode]).catch(()=>{});}}
  if(!navigator.onLine)throw new Error('This recognition model is not saved. Reconnect and use Download models, or choose produce manually.');
  return load();
 })().catch(error=>{models.delete(mode);throw error}));
 return models.get(mode);
}
export async function saveModels(onProgress){
 for(const mode of Object.keys(KEYS)){
  onProgress(`Saving ${mode==='single'?'single-produce':'multi-item'} model…`);
  const model=await getModel(mode);await model.model.save(KEYS[mode]);
 }
 if(navigator.storage?.persist)await navigator.storage.persist().catch(()=>false);
 return modelState();
}
export async function removeModels(){
 const tf=await runtime();
 for(const [mode,url] of Object.entries(KEYS)){
  const pending=models.get(mode);if(pending){const model=await pending.catch(()=>null);model?.model?.dispose();}
  models.delete(mode);await tf.io.removeModel(url).catch(()=>{});
 }
 return modelState();
}
