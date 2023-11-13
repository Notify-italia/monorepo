export interface AppError {
  error: { errors: { message: string; statusCode: number }[] };
}
