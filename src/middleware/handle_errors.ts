import { NextFunction, Request, Response } from 'express';
import Error from '../interfaces/my-errors';

const handleErrors = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = error.status || 500;
  const message = error.message || 'Server error.';
  return res.status(status).json({ status, message });
  _next();
};

export default handleErrors;
