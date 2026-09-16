import express, { type Router, type Request, type Response } from 'express';
import { getAllDecks, getDeckById, addDeck, updateDeck, deleteDeck} from '../middleware/decks.ts';
import { type Deck } from '../model/deck.ts';

const router: Router = express.Router();

router.get('/', (_req: Request, res: Response) => {
    try{
        const decks: Deck[] = getAllDecks();
        res.json(decks);
    } catch (err) {
        res.status(500).json({err: `Failed to read decks`});
    }
});

router.get('/:did', (req: Request<{did:number},{},{}>, res: Response) => {
    try{
        const deck: Deck | undefined = getDeckById(req.params.did);
        if(!deck){
            return res.status(404).json({err: 'Deck not found'});
        } 
        res.json(deck);
    } catch (err){
        res.status(500).json({err: 'Failed to read deck'});
    }
});

router.post('/', (req: Request<{},{},{name:string}>, res: Response) => {
    try{
        const result = addDeck(req.body.name);
        if(!result){
            return res.status(404).json({err: 'Deck not found'});
        }
        res.status(201).send();
    } catch (err){
        res.status(500).json({ err: 'Failed to create deck' })
    }
});

router.put('/:did', (req: Request<{did: number},{},{name:string}>, res: Response) => {
    try{
        const result = updateDeck(req.body.name, req.params.did);
        if(!result){
            return res.status(404).json({err: 'Deck not found'});
        }
        res.status(204).send();
    } catch (err){
        res.status(500).json({ err: 'Failed to update deck' })
    }
});

router.delete('/:did', async (req: Request<{did: number}, {}, {}>, res: Response) => {
    try {
        const result = await deleteDeck(req.params.did);
        if (!result) {
            return res.status(404).json({ error: 'Deck not found' });
        }
        res.status(204).send();
    } catch (err){
        res.status(500).json({ error: 'Failed to delete the deck' });
    }
});


export default router;