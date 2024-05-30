import deleteUser from 'modules/deleteUser';
import login from 'modules/login';
import signUp from 'modules/signUp';
import updateUser from 'modules/updateUser';
import knex from 'postgres/connection';
import * as readline from 'readline';

// Define the recursive function `rlHome` to handle the main menu and user interaction.
const rlHome = async (rl: readline.Interface): Promise<void> => {
  let isLogined = false;
  let userId;
  while (true) {
    if (!isLogined) {
      // Use a promise to handle the readline question asynchronously
      // Wait until the user enters the valid mode.
      const mode = await new Promise<string>((resolve) => {
        rl.question('Enter mode (login / signup / delete / update / exit): ', resolve);
      });
  
      // Determine the action based on the mode
      switch (mode) {
        // Do the login with the user's email and password.
        case 'login':
          console.log('Login mode selected');
          userId = await login(rl); // Assumed to handle its own login interactions
          isLogined = userId !== -1;
          break;
        // Create new user with the user's email and password.
        case 'signup':
          console.log('Sign up mode selected');
          await signUp(rl); // Assumed to handle its own sign up interactions
          break;
        // Delete the user by using the user's email and password.
        case 'delete':
          console.log('Deleting user mode');
          await deleteUser(rl);
          break;
        // Exit the server.
        case 'exit':
          console.log('Closing server');
          rl.close();
          return; // Exit the while loop and end the function
        default:
          console.log('Invalid mode');
          break; // The loop will continue, asking the question again
      }
    } else {
      // If user is already loginned, wait for the user's mode.
      const mode = await new Promise<string>((resolve) => {
        rl.question('Enter mode (update / logout / exit): ', resolve);
      });
      switch (mode) {
        // Update user's password.
        case 'update':
          console.log('Update user info');
          await updateUser(rl, userId!);
          break;
        // Logout the current account and go back to main home.
        case 'logout':
          console.log('Logging out');
          isLogined = false;
          break; // Logout by using flag.
        // Exit the program.
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
