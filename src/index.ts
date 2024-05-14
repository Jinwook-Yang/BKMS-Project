import express from 'express';
import connectDb from 'postgres/connectDb';
import * as readline from 'readline';
import server from 'server';

server();
// connectDb().then(() => {
//   server();
// })


// TODO?: create port for server?
// const app = express();
// const port = 3000;

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
  
// });
