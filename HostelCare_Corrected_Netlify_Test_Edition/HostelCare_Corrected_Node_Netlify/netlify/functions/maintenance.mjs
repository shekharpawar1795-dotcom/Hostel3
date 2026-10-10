import {loadState,saveState} from '../../store.js';
import {processDue} from '../../rules.js';
export default async ()=>{
 const {db,version}=await loadState();
 const stats=processDue(db,new Date());
 await saveState(version,db);
 console.log('HostelCare scheduled check:',stats);
};
export const config={schedule:'*/5 * * * *'};
