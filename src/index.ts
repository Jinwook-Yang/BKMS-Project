import connectDb from 'postgres/connectDb';
import knex from 'postgres/connection';
import * as readline from 'readline';
import deleteUser from 'modules/deleteUser';
import login from 'modules/login';
import searchMovie from 'modules/movie/searchMovie';
import signUp from 'modules/signUp';
import updateUser from 'modules/updateUser';
import recommendMovie from 'modules/movie/recommendMovie';
import rateMovie from 'modules/movie/rateMovie';
import getUserInfo from 'modules/userInfo';
import getMovieRanking from 'modules/ranking';

// Start Server with console
// Connect to DB first and check connection.
connectDb().then(async () => {
  await server();
});

// Main server function to initialize readline and start the application.
const server = async () => {
  // Create readline interface for user interaction.
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  try {
    // Start the main menu and user interaction.
    await rlHome(rl);
    // If user exits the server, close the readline interface and destroy the db connection.
    knex.destroy().finally(async () => {
      console.log('DB Connection disconnected.');
      console.log('All done.');
    });
  } catch (err) {
    console.error('An error occurred:', err);
    rl.close();
  }
};


// Define the recursive function `rlHome` to handle the main menu and user interaction.
const rlHome = async (rl: readline.Interface): Promise<void> => {
  let userId = -1;
  while (true) {
    if (userId === -1) {
      // Use a promise to handle the readline question asynchronously
      // Wait until the user enters the valid mode.
      const mode = await new Promise<string>((resolve) => {
        rl.question('Enter mode (login / signup / delete / exit): ', resolve);
      });
  
      // Determine the action based on the mode
      switch (mode) {
        // Do the login with the user's email and password.
        case 'login':
          console.log('Login mode selected');
          userId = await login(rl); // Assumed to handle its own login interactions
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
        rl.question('Enter mode (search / ranking / update / info / logout / exit): ', resolve);
      });
      switch (mode) {
        case 'search':
          // Search movie and recommend or rate the movie.
          console.log('Search movie');
          // Movie searched and selected by user.
          const selectedMovieId = await searchMovie(rl, userId!);
          // If the user selects -1, go back to the main menu.
          if (selectedMovieId === -1) {
            break;
          }
          const nextAction = await new Promise<string>((resolve) => {
            rl.question(`Enter action for the movie (recommend / rate / back): `, resolve);
          });
          switch (nextAction) {
            case 'recommend':
              // Get recommendation based on vector similarity.
              await recommendMovie(rl, userId, Number(selectedMovieId));
              break;
            case 'rate':
              // Rate the movie.
              await rateMovie(rl, userId, Number(selectedMovieId));
              break;
            case 'back':
              break;
            default:
              console.log('Invalid command');
              return;
          }
          break;
        // Get movie ranking based on average rating.
        case 'ranking':
          await getMovieRanking();
          break;
        // Update user's password.
        case 'update':
          console.log('Update user info');
          await updateUser(rl, userId);
          break;
        // Logout the current account and go back to main home.
        case 'logout':
          console.log('Logging out');
          userId = -1;
          break; // Logout by using flag.
        // Exit the program.
        case 'exit':
          console.log('Closing server');
          rl.close();
          return; // Exit the while loop and end the function
        // Get user info.
        case 'info':
          await getUserInfo(userId);
          break;
        default:
          console.log('Invalid mode');
          break; // The loop will continue, asking the question again
      }
    }
  }
};

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
