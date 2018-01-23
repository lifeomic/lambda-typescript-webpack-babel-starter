export async function sleep (duration: number) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, duration);
  });
}

export async function addAsync (num1: number, num2: number) {
  await sleep(0);
  return num1 + num2;
}
