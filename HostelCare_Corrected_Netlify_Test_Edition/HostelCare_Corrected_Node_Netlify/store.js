import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { emptyDatabase } from './data.js';

const table = 'hcms_state';
const file = path.resolve(process.env.LOCAL_DB_FILE || './.local-hcms-data.json');
const mapFields = Object.keys(emptyDatabase()).filter(k => emptyDatabase()[k] instanceof Map);
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const hosted = Boolean(process.env.NETLIFY || process.env.NODE_ENV === 'production');
const client = url && key ? createClient(url, key, {auth:{persistSession:false,autoRefreshToken:false}}) : null;
if (hosted && !client) throw new Error('Hosted deployment requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. Do not run with demo data.');

export function serialize(db) {
  const snapshot={};
  for (const [name,value] of Object.entries(db)) snapshot[name]=value instanceof Map ? [...value.entries()] : value;
  return snapshot;
}
export function deserialize(json={}) {
  const db=emptyDatabase();
  for(const k of Object.keys(db)) {
    if (mapFields.includes(k)) db[k]=new Map(Array.isArray(json[k])?json[k]:[]);
    else db[k]=Array.isArray(json[k])?json[k]:[];
  }
  return db;
}
export async function loadState() {
  if(client){
    const {data,error}=await client.from(table).select('version,payload').eq('id',1).single();
    if(error) throw new Error('Supabase state load failed. Run sql/setup.sql: '+error.message);
    return {version:data.version, db:deserialize(data.payload)};
  }
  try {const j=JSON.parse(await fs.readFile(file,'utf8'));return {version:j.version||0, db:deserialize(j.payload)};}
  catch(e){if(e.code!=='ENOENT')throw e;return {version:0,db:emptyDatabase()};}
}
export class WriteConflict extends Error {constructor(){super('Another user updated the data at the same time. Please refresh and repeat your action.');this.status=409;}}
export async function saveState(version, db) {
  const payload=serialize(db);
  if(client){
    const {data,error}=await client.rpc('hcms_state_commit',{expected_version:version,next_payload:payload});
    if(error)throw new Error('Supabase save failed: '+error.message);
    if(data !== true)throw new WriteConflict();
    return version+1;
  }
  // Local-only persistence. Hosted mode must use Supabase; JSON file is not a cloud database.
  const tmp=file+'.'+process.pid+'.tmp';
  await fs.writeFile(tmp,JSON.stringify({version:version+1,payload}),'utf8');
  await fs.rename(tmp,file);
  return version+1;
}
export function getStorage(){return client;}
