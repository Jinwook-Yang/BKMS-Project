import express from 'express';
import connectDb from 'postgres/connectDb';
import knex from 'postgres/connection';
import * as readline from 'readline';
import server from 'server';

// Start Server with console
// Connect to DB first and check connection.
connectDb().then(async () => {
  await server();
});

// On shut down, delete all db connections.
async function shutdown() {
  knex.destroy().finally(async () => {
    console.log('DB Connection disconnected.');
    console.log('All done.');
  });
}

process.on('SIGTERM', async () => {
  await shutdown();
});
