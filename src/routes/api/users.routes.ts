import { NextFunction, Request, Response, Router } from 'express';
import UserModel from '../../models/users.model';
import checkAuthToken from '../../middleware/check_auth_token';
import checkUserAccess from '../../middleware/check_user_access';

const routes = Router();
const userModel = new UserModel();

//- route for get all users
routes
  .route('/')
  .get(
    checkAuthToken,
    checkUserAccess,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const action = await userModel.getAllUsers();
        res.json({
          status: 'success',
          data: { ...action },
          message:
            action.length > 0
              ? 'Fount ' + action.length + ' Users'
              : 'There are no users',
        });
      } catch (err) {
        next(err);
      }
    }
  );

//- route for add new users to db
routes
  .route('/')
  .post(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const action = await userModel.create(req.body);
        res.json({
          status: 'success',
          data: { ...action },
          message: 'User created successfully',
        });
      } catch (err) {
        next(err);
      }
    }
  );

//- route for update user
routes
  .route('/:id')
  .patch(
    checkAuthToken,
    checkUserAccess,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const action = await userModel.updateUser(req.body);
        res.json({
          status: 'success',
          data: { ...action, id: req.params.id as string },
          message: 'User updated successfully',
        });
      } catch (err) {
        next(err);
      }
    }
  );

//- route for delete all users
routes
  .route('/')
  .delete(
    checkAuthToken,
    checkUserAccess,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        await userModel.deleteAllUser();
        res.json({
          status: 'success',
          data: {},
          message: 'All users have been successfully deleted',
        });
      } catch (err) {
        next(err);
      }
    }
  );

//- route for delete user
routes
  .route('/:id')
  .delete(
    checkAuthToken,
    checkUserAccess,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const action = await userModel.deleteUser(req.params.id as string);
        res.json({
          status: 'success',
          data: action,
          message: 'User deleted successfully',
        });
      } catch (err) {
        next(err);
      }
    }
  );

//- route for get one user from db by user id
routes
  .route('/:id')
  .get(
    checkAuthToken,
    checkUserAccess,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const action = await userModel.getUserByID(req.params.id as string);
        res.json({
          status: 'success',
          data: action,
          message: 'Found user successfully',
        });
      } catch (err) {
        next(err);
      }
    }
  );

//- route for check if user is blocked
routes
  .route('/block/:id')
  .get(
    checkAuthToken,
    checkUserAccess,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const action = await userModel.checkUserBlock(req.params.id as string);
        res.json({
          status: 'success',
          data: action,
          message: 'User block is ' + action,
        });
      } catch (err) {
        next(err);
      }
    }
  );

//- route for block or unblock user
routes
  .route('/block/:id')
  .post(
    checkAuthToken,
    checkUserAccess,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const action = await userModel.changeUserBlock(req.params.id as string);
        res.json({
          status: 'success',
          data: action,
          message: 'User block is ' + action,
        });
      } catch (err) {
        next(err);
      }
    }
  );

export default routes;
