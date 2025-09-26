import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;
import cors from 'cors';

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
