import { UsersModel } from 'models/users';
import { question } from 'modules/utils';
import * as readline from 'readline';

const questionLogin = async (rl: readline.Interface, text: string) => await question(
  rl, `Enter ${text} to login (Enter exit to stop): `,
)

const login = async (rl: readline.Interface) => {
  let id, pw;
  id = await questionLogin(rl, 'Id');
  if (id === 'exit') {
    return;
  }
  pw = await questionLogin(rl, 'Password');
  if (pw === 'exit') {
    return;
  }
  try {
    const result = await UsersModel.findOne({
      userId: id,
      password: pw,
    });
    if (result) {
      console.log('User login success!');
    } else {
      console.log('User login failed!');
    }
    return;
  } catch (error) {
    console.log(error);
  }
  // login by id and password.
}

export default login;
