export type ErrorResponse = { code: string; message: string };

const responseGenerator = (data?: any, message?: string) => { // todo fix any
  return { data, message };
};
export { responseGenerator };
