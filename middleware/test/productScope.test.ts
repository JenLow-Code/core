import test from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from './helpers/app.ts';
import {handleProduct,type Product} from '../src/core/productScope.ts';
const subject='4ec693bf-0d25-4ad8-8284-9f3b8cb0ca79';
const sid='ee0f45c1-7e15-43a0-a242-f2a87bcb05f8';
const upstream='header.'+Buffer.from(JSON.stringify({sub:subject,session_id:sid})).toString('base64url')+'.fixture';
test('four fixed scopes share identity but not tokens, profile, roles or Network display data',async()=>{
 const app=createApp({env:{ENVIRONMENT:'production',PRODUCT:'network'}});
 const old=globalThis.fetch;
 globalThis.fetch=async()=>Response.json({id:subject,email:'scope@example.test',email_confirmed_at:'2026-11-01T00:00:00Z',is_anonymous:false,user_metadata:{display_name:'Network-only name'}});
 const products:Product[]=['network','tools','production','live'];
 const call=async(product:Product,path:string,token:string,method='GET')=>handleProduct(new Request('https://middleware.internal'+path,{method,headers:{authorization:'Bearer '+token,'X-Product':'network','X-User-Id':'forged'}}),app.env,product);
 const sessions:Record<string,{token:string,id:string,profile:string}>={};
 try{
  for(const product of products){
   const r=await call(product,'/v1/auth/supabase/exchange',upstream,'POST');
   assert.equal(r.status,200,await r.clone().text());
   const body=await r.json() as {accessToken:string;user:{id:string;profileId:string;displayName?:string}};
   if(product!=='network')assert.equal(body.user.displayName,undefined);
   sessions[product]={token:body.accessToken,id:body.user.id,profile:body.user.profileId};
  }
  assert.equal(new Set(Object.values(sessions).map(x=>x.id)).size,1);
  assert.equal(new Set(Object.values(sessions).map(x=>x.profile)).size,4);
  app.db.raw.prepare("INSERT INTO product_role_grants(profile_id,role) VALUES(?,'admin')").run(sessions.network.profile);
  for(const product of products){
   const r=await call(product,'/v1/auth/me',sessions[product].token);
   assert.equal(r.status,200);
   const body=await r.json() as {user:{display_name?:string;handle?:string;product:string;roles:string[]}};
   assert.equal(body.user.product,product);
   assert.deepEqual(body.user.roles,product==='network'?['admin']:[]);
   if(product!=='network'){assert.equal(body.user.display_name,undefined);assert.equal(body.user.handle,undefined);}
   for(const other of products.filter(p=>p!==product)){
    assert.equal((await call(product,'/v1/auth/me',sessions[other].token)).status,401);
    assert.equal((await call(product,'/v1/auth/session/revoke',sessions[other].token,'POST')).status,401);
   }
  }
  assert.equal((await call('tools','/v1/auth/session/revoke',sessions.tools.token,'POST')).status,200);
  assert.equal((await call('tools','/v1/auth/me',sessions.tools.token)).status,401);
  assert.equal((await call('network','/v1/auth/me',sessions.network.token)).status,200);
 }finally{globalThis.fetch=old;}
});
