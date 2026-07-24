import express from 'express';
import downloadHandler from './api/download.js';

const app = express();
const port = process.env.PORT || 3000;

app.get('/api/download', downloadHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
