import { NextFunction, Request, Response, Router } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import config from '../../config';
import UserAuth from '../../models/auth.model';

const routes = Router();
const userAuth = new UserAuth();

//- route for auth user
routes.post(
  '/',
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<string, Record<string, string>>> => {
    try {
      const { user_email, password } = req.body;
      const action = await userAuth.auth(user_email, password);
      if (!action) {
        return res.status(401).json({
          status: 'error',
          message: 'The email or password is incorrect',
        });
      }
      const token = jsonwebtoken.sign(
        { action },
        config.token_secret as string
      );
      await userAuth.saveToken(user_email, token);
      return res.json({
        status: 'success',
        data: { ...action, token },
        message: 'login successfully',
      });
    } catch (err) {
      next(err);
    }
    return res.status(401).json({
      status: 'error',
      message: 'Unable to login',
    });
  }
);

export default routes;
