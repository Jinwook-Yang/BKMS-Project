import { UsersModel } from 'models/users';
import { question } from 'modules/utils';
import * as readline from 'readline';

const questionSignUp = async (rl: readline.Interface, text: string) => await question(
  rl, `Enter ${text} to create (Enter exit to stop): `,
)

// Sign up to new account.
const signUp = async (rl: readline.Interface) => {
  let id;
  while (1) {
    id = await questionSignUp(rl, 'Id');
    // Check if the id already exists.
    const result = await UsersModel.findOne({ user_email: id });
    if (result) {
      console.log('Id already exists! Try different Id!');
      continue;
    }
    if (id === 'exit') {
      return;
    }
    break;
  }
  // Wait for the user enters the password.
  let pw = await questionSignUp(rl, 'Password');
  if (pw === 'exit') {
    return;
  }
  // Wait for the user to enter the name.
  let userName = await questionSignUp(rl, 'User Name');
  if (userName == 'exit') {
    return;
  }
  try {
    // Create user using user's email and name and password.
    await UsersModel.create({
      user_email: id,
      user_name: userName,
      password: pw,
    });
    console.log(`User ${userName} created!`);
    return;
  } catch (error) {
    console.log(error);
  }
}

export default signUp;
