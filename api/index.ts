import app, { connectDB } from '../server/src/index';

// Ensure MongoDB is connected before handling any request (serverless cold starts)
// We patch the app with a one-time connection middleware
const originalHandler = app;

let dbReady = false;
app.use(async (_req: any, _res: any, next: any) => {
    if (!dbReady) {
        try {
            await connectDB();
            dbReady = true;
        } catch (err) {
            return next(err);
        }
    }
    next();
});

export default originalHandler;
