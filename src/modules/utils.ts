import * as readline from 'readline';

// Util function to wait the user to answer the given question at console.
export const question = async (
  rl: readline.Interface, prompt: string, allowEmpty = false,
) => new Promise((resolve) => {
  rl.question(prompt, (mode) => {
    if (allowEmpty && mode === '') {
      resolve(mode);
    } else if (mode) {
      resolve(mode);
    }
  });
});
