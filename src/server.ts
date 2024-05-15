import login from 'modules/login';
import signUp from 'modules/signUp';
import knex from 'postgres/connection';
import * as readline from 'readline';

// Define the recursive function `rlHome` to handle the main menu and user interaction.
const rlHome = async (rl: readline.Interface): Promise<void> => {
  let isLogined = false;
  while (true) {
    if (!isLogined) {
      // Use a promise to handle the readline question asynchronously
      const mode = await new Promise<string>((resolve) => {
        rl.question('Enter mode (1: login mode, 2: sign up mode, exit: to exit): ', resolve);
      });
  
      // Determine the action based on the mode
      switch (mode) {
        case '1':
          console.log('Login mode selected');
          isLogined = await login(rl); // Assumed to handle its own login interactions
          break;
        case '2':
          console.log('Sign up mode selected');
          await signUp(rl); // Assumed to handle its own sign up interactions
          break;
        case 'exit':
          console.log('Closing server');
          rl.close();
          return; // Exit the while loop and end the function
        default:
          console.log('Invalid mode');
          break; // The loop will continue, asking the question again
      }
    } else {
      const mode = await new Promise<string>((resolve) => {
        rl.question('Enter mode (logout: to logout, exit: to exit): ', resolve);
      });
      switch (mode) {
        case 'logout':
          console.log('Logging out');
          isLogined = false;
          break; // Logout by using flag.
        case 'exit':
          console.log('Closing server');
          rl.close();
          return; // Exit the while loop and end the function
        default:
          console.log('Invalid mode');
          break; // The loop will continue, asking the question again
      }
    }
  }
};

// Main server function to initialize readline and start the application.
const server = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  try {
    await rlHome(rl);
    knex.destroy().finally(async () => {
      console.log('DB Connection disconnected.');
      console.log('All done.');
    });
  } catch (err) {
    console.error('An error occurred:', err);
    rl.close();
  }
};

export default server;
