import express, { type Express } from 'express';
import decksRouter from './route/decks.ts';
import cardsRouter from './route/cards.ts';
import cors from 'cors';

const app: Express = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/decks', decksRouter, cardsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 