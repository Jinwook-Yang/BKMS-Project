import { UsersModel } from 'models/users';
import { question } from 'modules/utils';
import * as readline from 'readline';

const questionLogin = async (rl: readline.Interface, text: string) => await question(
  rl, `Enter ${text} to login (Enter exit to stop): `,
)

// Login to user by using the id and password.
const login = async (rl: readline.Interface): Promise<number> => {
  let id, pw;
  id = await questionLogin(rl, 'Id');
  if (id === 'exit') {
    return -1;
  }
  pw = await questionLogin(rl, 'Password');
  if (pw === 'exit') {
    return -1;
  }
  try {
    const result = await UsersModel.findOne({
      user_email: id,
      password: pw,
    });
    if (result) {
      console.log('User login success!');
      console.log(`Welcome! ${result.user_name}`);
      return result.id;
    } else {
      console.log('User login failed!');
      return -1;
    }
  } catch (error) {
    console.log(error);
    return -1;
  }
}

export default login;
