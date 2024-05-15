import { UsersModel } from 'models/users';
import { question } from 'modules/utils';
import * as readline from 'readline';

const questionDeleteUser = async (rl: readline.Interface, text: string) => await question(
  rl, `Enter ${text} to delete (Enter exit to stop): `,
)

const deleteUser = async (rl: readline.Interface): Promise<boolean> => {
  let id, pw;
  id = await questionDeleteUser(rl, 'Id');
  if (id === 'exit') {
    return false;
  }
  pw = await questionDeleteUser(rl, 'Password');
  if (pw === 'exit') {
    return false;
  }
  try {
    const result = await UsersModel.findOne({
      userId: id,
      password: pw,
    });
    if (result) {
      while (true) {
        const input = await question(rl, `Are you sure to delete user named ${result.userName}? (yes or no): `);
        if (input === 'yes') {
          await UsersModel.deleteById(result.id);
          console.log('User deleted!');
          return true;
        } else if (input === 'no') {
          console.log('User delete canceled!');
          return false;
        } else {
          console.log('Invalid input!');
        }
      }
    } else {
      console.log('User does not exist!');
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export default deleteUser;