import http from 'node:http';
import next from 'next';
import {api} from '../worker/api.mjs';
const port=Number(process.env.PORT||3000);const app=next({dev:true});await app.prepare();const handle=app.getRequestHandler();
http.createServer(async(req,res)=>{if(req.url.startsWith('/api/')){const r=await api(new Request('http://localhost:'+port+req.url,{method:req.method}));res.writeHead(r.status,Object.fromEntries(r.headers));res.end(Buffer.from(await r.arrayBuffer()));}else await handle(req,res);}).listen(port,()=>console.log('Ari: http://localhost:'+port));
