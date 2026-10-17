import http from 'node:http';
import worker from '../dist/server/index.js';
const port=Number(process.env.PORT||3000);
http.createServer(async(req,res)=>{try{const r=await worker.fetch(new Request('http://localhost:'+port+req.url,{method:req.method}));res.writeHead(r.status,Object.fromEntries(r.headers));res.end(Buffer.from(await r.arrayBuffer()));}catch{res.writeHead(500);res.end('Unable to serve this request.');}}).listen(port,()=>console.log('Ari: http://localhost:'+port));
