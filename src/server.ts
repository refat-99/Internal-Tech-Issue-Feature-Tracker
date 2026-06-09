import express, {type Request, type Response, type Application } from 'express';
const app : Application = express();
const port = 5000;

app.get('/', (req: Request, res: Response) => {
  //res.send('Issue Traker Server is running!');

  res.status(200).json({
    message: 'Issue Tracker Server is running!',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});