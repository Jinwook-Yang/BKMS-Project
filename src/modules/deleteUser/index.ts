import { UsersModel } from 'models/users';
import { question } from 'modules/utils';
import knex from 'postgres/connection';
import * as readline from 'readline';

const questionDeleteUser = async (rl: readline.Interface, text: string) => await question(
  rl, `Enter ${text} to delete (Enter exit to stop): `,
)

// Delete user if the user enters the correct Id and Password.
const deleteUser = async (rl: readline.Interface) => {
  let id, pw;
  id = await questionDeleteUser(rl, 'Id');
  if (id === 'exit') {
    return;
  }
  pw = await questionDeleteUser(rl, 'Password');
  if (pw === 'exit') {
    return;
  }
  try {
    // Check if the user exists.
    await knex.transaction(async (trx) => {
      // Lock user's row to prevent other user to delete the user.
      const result = await UsersModel.table().where({
        user_email: id,
        password: pw,
      } as any).first().forUpdate().transacting(trx);
      if (result) {
        while (true) {
          // Check if the user really want to delete.
          const input = await question(rl, `Are you sure to delete user named ${result.user_name}? (yes or no): `);
          if (input === 'yes') {
            await UsersModel.table().where({ id: result.id }).del().transacting(trx);
            console.log('User deleted!');
            return;
          } else if (input === 'no') {
            console.log('User delete canceled!');
            return;
          } else {
            console.log('Invalid input!');
          }
        }
      } else {
        console.log('User does not exist!');
        return;
      }
    });
  } catch (error) {
    console.log(error);
    return;
  }
}

export default deleteUser;
