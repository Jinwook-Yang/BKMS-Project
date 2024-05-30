import { UsersModel } from 'models/users';;
import { SettingsModel } from 'models/settings';

// Initialize database by creating tables and user.
const initDb = async () => {
  // Create table if not exists.
  await UsersModel.createTableIfNotExists();
  await SettingsModel.createTableIfNotExists();
  console.log('Table creation complete');

  // Check if the admin exists and create if not exists.
  const isAdminExists = await UsersModel.findOne({
    userEmail: 'admin',
    password: 'admin',
  });
  if (!isAdminExists) {
    const admin = await UsersModel.create({
      userEmail: 'admin',
      userName: 'admin',
      password: 'admin',
    });
    await SettingsModel.create({
      userId: admin[0].id,
      isAdmin: true,
    });
  }
};

export default initDb;
