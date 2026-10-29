import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
const platform=process.argv[2];
if(!['android','ios'].includes(platform))throw Error('Choose android or ios.');
const cli='node_modules/@capacitor/cli/bin/capacitor';
function run(args){const result=spawnSync(process.execPath,[cli,...args],{stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);}
if(!existsSync(platform))run(['add',platform]);
run(['sync',platform]);
console.log(`Native ${platform} source is ready. Open it with npx cap open ${platform}. Signing/building requires the platform SDK.`);
