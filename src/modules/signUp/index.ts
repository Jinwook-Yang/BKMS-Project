import { UsersModel } from 'models/users';
import { question } from 'modules/utils';
import * as readline from 'readline';

const questionSignUp = async (rl: readline.Interface, text: string) => await question(
  rl, `Enter ${text} to create (Enter exit to stop): `,
)

const signUp = async (rl: readline.Interface) => {
  let id, pw;
  while (1) {
    id = await questionSignUp(rl, 'Id');
    const result = await UsersModel.findOne({ userId: id });
    if (result) {
      console.log('Id already exists! Try different Id!');
      continue;
    }
    if (id === 'exit') {
      return;
    }
    break;
  }
  pw = await questionSignUp(rl, 'Password');
  if (pw === 'exit') {
    return;
  }
  try {
    await UsersModel.create({
      userId: id,
      password: pw,
    });
    console.log('User created');
    return;
  } catch (error) {
    console.log(error);
  }
}

export default signUp;
