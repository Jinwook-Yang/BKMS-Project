import { question } from 'modules/utils';
import * as readline from 'readline';

const questionSignUp = async (rl: readline.Interface, text: string) => await question(
  rl, `Enter ${text} to create (Enter exit to stop): `,
)

const signUp = async (rl: readline.Interface) => {
  let id, pw;
  id = await questionSignUp(rl, 'Id');
  if (id === 'exit') {
    return;
  }
  pw = await questionSignUp(rl, 'Password');
  if (pw === 'exit') {
    return;
  }
  console.log(id, pw);
  // create by id and password.
}

export default signUp;
