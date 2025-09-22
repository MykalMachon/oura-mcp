export function add(a: number, b: number): number {
  return a + b;
}

import express from 'express';
import type { Request, Response} from 'express';

import cors from 'cors';


import { OuraApi } from "./client.ts";


const startServer = () => {
// initialize server
const app = express();

// basic middlewares
app.use(express.json());
app.use(cors())

// routes
app.get('/', (req: Request, res: Response) => {
  console.log('Received request for /');
  res.send('Hello World!')
})

// start web server
const PORT = Deno.env.get('PORT') || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

return app;
}
 


// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  // ensure the API_KEY is set
  const apiKey = Deno.env.get('API_KEY');
  if(!apiKey) throw new Error('API_KEY is not set');

  // test the API 
  const api = new OuraApi(apiKey);
  const readiness = await api.getDailyReadiness();
  console.log(readiness);
}
