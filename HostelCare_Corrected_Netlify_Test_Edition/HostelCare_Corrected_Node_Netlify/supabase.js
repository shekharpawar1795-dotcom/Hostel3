import {getStorage} from './store.js';
const bucket=process.env.SUPABASE_STORAGE_BUCKET||'complaint-photos';
export const isSupabaseConfigured=Boolean(getStorage());
export async function uploadPhotoToSupabase(buffer, attachmentId, mimeType){
 const db=getStorage();if(!db)return null;
 // Always a PRIVATE bucket. No getPublicUrl, no public ACL and no user-input path.
 const key=`evidence/${attachmentId}`;
 const {error}=await db.storage.from(bucket).upload(key,buffer,{contentType:mimeType,upsert:false});
 if(error)throw new Error('Evidence photo upload failed: '+error.message);
 return key;
}
export async function downloadPhotoFromSupabase(key){
 const db=getStorage();if(!db)throw new Error('Storage not configured');
 const {data,error}=await db.storage.from(bucket).download(key);
 if(error)throw error;
 return Buffer.from(await data.arrayBuffer());
}
