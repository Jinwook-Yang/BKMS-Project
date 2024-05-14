import express from 'express';
import connectDb from 'postgres/connectDb';
import knex from 'postgres/connection';
import * as readline from 'readline';
import server from 'server';

connectDb().then(async () => {
  await server();
});

async function shutdown() {
  knex.destroy().finally(async () => {
    console.log('DB Connection disconnected.');
    console.log('All done.');
  });
}

process.on('SIGTERM', async () => {
  await shutdown();
});


// TODO?: create port for server?
// const app = express();
// const port = 3000;

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
  
// });
