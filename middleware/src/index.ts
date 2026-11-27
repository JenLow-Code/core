import type {Env} from './core/config';
import type {ExecutionContext,ScheduledController} from './core/platform';
import {handle} from './app';
import {WorkerEntrypoint} from 'cloudflare:workers';
import {handleProduct} from './core/productScope';

// A binding selects its fixed product at deployment, not through an HTTP header.
export class NetworkSecurity extends WorkerEntrypoint<Env> { fetch(request:Request){return handleProduct(request,this.env,'network',this.ctx);} }
export class ToolsSecurity extends WorkerEntrypoint<Env> { fetch(request:Request){return handleProduct(request,this.env,'tools',this.ctx);} }
export class ProductionSecurity extends WorkerEntrypoint<Env> { fetch(request:Request){return handleProduct(request,this.env,'production',this.ctx);} }
export class LiveSecurity extends WorkerEntrypoint<Env> { fetch(request:Request){return handleProduct(request,this.env,'live',this.ctx);} }
export default {
 fetch(request:Request,env:Env,ctx:ExecutionContext){return handle(request,{...env,PRODUCT:'network',PROVISION_TECHNICAL_PROFILE:false},ctx);},
 async scheduled(_controller:ScheduledController,env:Env,ctx:ExecutionContext){
   ctx.waitUntil(env.DB.prepare('DELETE FROM auth_rate_limits WHERE expires_at<?').bind(Math.floor(Date.now()/1000)).run());
 }
};
