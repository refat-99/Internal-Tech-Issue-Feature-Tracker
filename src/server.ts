
import app from './app';
import {config} from './config';
import { initDB } from './db/db';

const port = config.port || 5000;
const main = () =>{
  initDB();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

main();