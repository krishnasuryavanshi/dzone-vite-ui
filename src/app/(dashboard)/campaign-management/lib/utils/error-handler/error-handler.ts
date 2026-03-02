export const handleApiError = (error: any) => {
  try {
    const fileErrorBytes = Buffer.from(error?.data);
    const fileErrorString = fileErrorBytes.toString();
    return JSON.parse(fileErrorString);
  } catch (err) {
    return { message: 'An unexpected error occurred', statusCode: 500 };
  }
};
