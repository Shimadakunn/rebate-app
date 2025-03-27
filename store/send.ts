export const sendTx = async (data: string[][]) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return data.map(() => Math.random().toString());
};
