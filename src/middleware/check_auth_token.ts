import { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import config from '../config';

//- check auth token
const checkAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response<string, Record<string, string>> => {
  const msg = 'Login error';
  try {
    const header_token = req.get('Authorization');
    if (header_token) {
      const bearer = header_token.split(' ')[0];
      const token = header_token.split(' ')[1];
      if (token && bearer.toLowerCase() == 'bearer') {
        const decode_token = jsonwebtoken.verify(
          token,
          config.token_secret as string
        );
        if (decode_token) {
          return next();
        } else {
          return res.status(401).json({ status: 401, message: msg });
        }
      } else {
        return res.status(401).json({ status: 401, message: msg });
      }
    } else {
      return res.status(401).json({ status: 401, message: msg });
    }
  } catch (err) {
    return res.status(401).json({ status: 401, message: msg });
  }
};

export default checkAuthToken;
