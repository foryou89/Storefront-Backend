import express, { Application, Request, Response } from 'express';
import MyAppRateLimit from 'express-rate-limit';
import morgan from 'morgan';
import helmet from 'helmet';
import handleErrors from './middleware/handle_errors';
import routes from './routes';
import config from './config';

const PORT: number = parseInt(config.server_port as string) || 3000;

//- create an instance server
const MyApp: Application = express();

//- HTTP request logger middleware by morgan
MyApp.use(morgan('dev'));

//- HTTP request logger middleware by helmet
MyApp.use(helmet());

//- use express json
MyApp.use(express.json());

//- rate limit
MyApp.use(
  MyAppRateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'to many request',
  })
);

//- routes for all api
MyApp.use('/api', routes);

//- path for home page
MyApp.get(
  '/',
  async (
    req: Request,
    res: Response
  ): Promise<express.Response<string, Record<string, string>>> => {
    return res
      .status(200)
      .send('Hello from storefront backend project, By: Ahmed Mohamed');
  }
);

//- user handleErrors middleware
MyApp.use(handleErrors);

//- error if other path
MyApp.use(
  (
    _req: Request,
    res: Response
  ): express.Response<string, Record<string, string>> => {
    return res.status(404).send('Error 404 Not found');
  }
);

//- start server
MyApp.listen(PORT, (): void => {
  console.info('Server is starting now at port:' + PORT);
});
export default MyApp;
