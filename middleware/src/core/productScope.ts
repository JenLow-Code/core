import type {Env} from './config';
import type {ExecutionContext} from './platform';
import {handle} from '../app';
export type Product=NonNullable<Env['PRODUCT']>;
/** Called only from the fixed named entrypoint of a private service binding. */
export function handleProduct(request:Request,env:Env,product:Product,ctx?:ExecutionContext){
  return handle(request,{...env,PRODUCT:product,PROVISION_TECHNICAL_PROFILE:true},ctx);
}
