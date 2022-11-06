import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/users.model';
import User from '../types/users.type';

const userModel = new UserModel();

// check if user has permissions to edit or delete
const checkUserAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response<string, Record<string, string>>> => {
  const msg = 'You dont have permissions';
  try {
    const header_token = req.get('Authorization');
    if (header_token && header_token != '') {
      const token = header_token.split(' ')[1];
      const access_user: User = await userModel.getUserByToken(token);
      const is_admin: boolean = access_user.is_admin;
      const userid: string = access_user.id;
      //-- check access
      //-- permissions to fetch data
      if (req.method.toLowerCase() == 'get') {
        if (req.params.id) {
          //- error if not admin and not this user
          if (req.params.id != userid && !is_admin) {
            return res.status(401).json({ status: 401, message: msg });
          }
        } else {
          //- error if not admin, can't fetch all users data
          if (!is_admin) {
            return res.status(401).json({ status: 401, message: msg });
          }
        }
      }
      if (req.method.toLowerCase() == 'post') {
        if (req.params.id) {
          //- error if not admin, can't block user
          if (!is_admin) {
            return res.status(401).json({ status: 401, message: msg });
          }
        }
      }
      if (req.method.toLowerCase() == 'delete') {
        //- error if not admin, can't delete user
        if (!is_admin) {
          return res.status(401).json({ status: 401, message: msg });
        }
      }
      if (req.method.toLowerCase() == 'patch') {
        if (req.params.id) {
          //- error if not admin and not this user, can't edit all users data
          if (req.params.id != userid && !is_admin) {
            return res.status(401).json({ status: 401, message: msg });
          }
        }
      }
      return next();
    }
  } catch (err) {
    return res.status(401).json({ status: 401, message: msg });
  }
};

export default checkUserAccess;
