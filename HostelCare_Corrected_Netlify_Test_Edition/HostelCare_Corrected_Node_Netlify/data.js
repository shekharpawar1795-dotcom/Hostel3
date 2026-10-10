import crypto from 'node:crypto';
import { AsyncLocalStorage } from 'node:async_hooks';

export const CATEGORIES = ['ELECTRICAL','PLUMBING','FURNITURE','CLEANING','INTERNET','DOOR_LOCK','BATHROOM','PEST_CONTROL','OTHER'];
export const PRIORITIES = ['NORMAL','URGENT','EMERGENCY'];
export const ROLES = ['STUDENT','RECTOR','MAINTENANCE_STAFF','DEAN','SYSTEM_ADMIN'];
export const OPEN_STATES = ['SUBMITTED','UNDER_REVIEW','ASSIGNED','ACCEPTED','IN_PROGRESS','ON_HOLD','AWAITING_CONFIRMATION','REOPENED'];
// Native scrypt password hashing: per-user random salt, constant-time check.
export function hashPassword(password){
 const salt=crypto.randomBytes(16);
 const derived=crypto.scryptSync(password,salt,64,{N:16384,r:8,p:1});
 return `scrypt:${salt.toString('hex')}:${derived.toString('hex')}`;
}
export function verifyPassword(password,encoded){
 try{const [type,hexSalt,hexHash]=String(encoded).split(':');
 if(type!=='scrypt')return false;
 const hash=Buffer.from(hexHash,'hex');if(hash.length!==64)return false;
 const actual=crypto.scryptSync(password,Buffer.from(hexSalt,'hex'),64,{N:16384,r:8,p:1});
 return crypto.timingSafeEqual(hash,actual);
 }catch{return false;}
}
export const generateId = () => crypto.randomUUID();
export const generateToken = () => crypto.randomBytes(48).toString('base64url');
export const hashToken = token => crypto.createHash('sha256').update(token).digest('hex');
export const requestContext = new AsyncLocalStorage();
export function emptyDatabase() {
  return { users:new Map(), sessions:new Map(), hostels:new Map(), rooms:new Map(),
    allocations:new Map(), scopes:new Map(), complaints:new Map(), workCycles:new Map(),
    assignments:new Map(), events:new Map(), escalations:new Map(), attachments:new Map(),
    notifications:new Map(), feedback:new Map(), adminAudit:[], loginAttempts:[] };
}
export const db = new Proxy({}, {
  get(_,key) {const context=requestContext.getStore(); if(!context) throw new Error('DB read outside request context'); return context.db[key];},
  set(_,key,value) {const context=requestContext.getStore(); if(!context) throw new Error('DB write outside request context'); context.db[key]=value; return true;}
});
