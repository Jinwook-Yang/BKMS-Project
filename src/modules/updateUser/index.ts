import { UsersModel } from 'models/users';
import { question } from 'modules/utils';
import * as readline from 'readline';

const questionUpdate = async (rl: readline.Interface, text: string) => await question(
  rl, `Enter ${text} to update (Enter exit to stop, Enter nothing to maintain): `, true,
);

// Update user's password and user's name if the user is already loginned.
// Use the userId which is PK index of the user table.
const updateUser = async (rl: readline.Interface, userId: number) => {
  let pw = await questionUpdate(rl, 'Password');
  if (pw === 'exit') {
    return;
  }
  let userName = await questionUpdate(rl, 'User Name');
  if (userName === 'exit') {
    return;
  }
  try {
    const update = {
      ...(pw !== '' ? { password: pw } : {}),
      ...(userName !== '' ? { userName } : {}),
    };
    if (Object.keys(update).length === 0) {
      console.log('Nothing to update!');
      return;
    }
    await UsersModel.update(userId, update);
  } catch (error) {
    console.log(error);
    return;
  }
}

export default updateUser;
