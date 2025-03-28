import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import expressWinston from 'express-winston';
import helmet from 'helmet';
import routes from './routes';
import { requestHandler, errorHandler, requestLogger } from './middlewares';

const app: Express = express();

app.use(helmet());

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
  }),
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
if (
  process.env.DATABASE_URL !==
  'postgres://postgres:docker@localhost:5433/bookworms-test'
) {
  app.use(
    expressWinston.logger({
      winstonInstance: requestLogger,
      statusLevels: true,
    }),
  );
}
expressWinston.requestWhitelist.push('body');
expressWinston.responseWhitelist.push('body');
app.use(routes);

app.use(errorHandler);
app.use(requestHandler);
if (
  process.env.DATABASE_URL !==
  'postgres://postgres:docker@localhost:5433/bookworms-test'
) {
  app.use(expressWinston.errorLogger({ winstonInstance: requestLogger }));
}

export default app;
