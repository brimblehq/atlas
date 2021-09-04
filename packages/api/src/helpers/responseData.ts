const responseData = (
  message: string,
  error: boolean,
  status: number,
  data: any = []
) => {
  return { message, error, status, data };
};
export default responseData;
