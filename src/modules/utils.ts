import * as readline from 'readline';

export const question = async (rl: readline.Interface, prompt: string) => new Promise((resolve) => {
  rl.question(prompt, (mode) => {
    if (mode) {
      resolve(mode);
    }
  });
});
