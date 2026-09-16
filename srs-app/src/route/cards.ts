import express, { type Router, type Response, type Request } from 'express';
import { getAllCards, getCardById, addCard, updateCard, deleteCard, updateReview } from '../middleware/cards.ts';
import { type Card, type CreateCard } from '../model/card.ts'; 
import { getDeckById } from '../middleware/decks.ts';

const router: Router = express.Router();

router.get('/:did/cards', (req: Request<{did: number}, {}, {}>, res: Response) => {
    try{
        if(!getDeckById(req.params.did)) { return res.status(404).json({ err: 'Deck not found'});}
        const cards = getAllCards(req.params.did);
        if(!cards){
            return res.status(404).json({ err: 'No card found'});
        }
        res.json(cards);
    } catch (err){
        res.status(500).json({err: 'Failed to read cards'});
    }

});

router.get('/:did/cards/:cid', (req: Request<{did: number, cid: number}, {}, {}>, res: Response) => {
    try{
        if(!getDeckById(req.params.did)) { return res.status(404).json({ err: 'Deck not found'});}
        const card: Card | undefined = getCardById(req.params.did, req.params.cid);
        if (!card){
            return res.status(404).json({ err: 'Card not found'});
        }
        res.json(card);
    } catch (err){
        res.status(500).json({err: 'Failed to read card'});
    }
});

router.post('/:did/cards', (req: Request<{did: number}, {}, CreateCard>, res: Response) => {
    try{
        if(!getDeckById(req.params.did)) { return res.status(404).json({ err: 'Deck not found'});}
        const result = addCard(req.body, req.params.did);
        if (!result){
            res.status(500).json({ err: 'Failed to create the card' });
        }
        res.status(201).json({ message: 'Card created successfully'});
    } catch (err){
        res.status(500).json({ err: 'Failed to create the card' });
    }
});

router.put('/:did/cards/:cid', (req: Request<{cid: number, did: number}, {}, CreateCard>, res: Response) => {
    try{
        if(!getDeckById(req.params.did)) { return res.status(404).json({ err: 'Deck not found'});}
        const result = updateCard(req.params.cid, req.params.did, req.body);
        if (!result){
            res.status(404).json({ err: 'Card not found' });
        }
        res.status(204).send();
    } catch (err){
        res.status(500).json({ err: 'Failed to update the card' });
    }
});

router.delete('/:did/cards/:cid', (req: Request<{cid: number, did: number}, {}, {}>, res: Response) => {
    try{
        if(!getDeckById(req.params.did)) { return res.status(404).json({ err: 'Deck not found'});}
        const result = deleteCard(req.params.cid, req.params.did);
        if (!result){
            res.status(404).json({ err: 'Card not found' });
        }
        res.status(204).send();
    } catch (err){
        res.status(500).json({ err: 'Failed to delete the card' });
    }
});

router.put('/:did/cards/:cid/review', (req: Request<{cid: number, did: number}, {}, {quality: number, card: Card}>, res: Response) => {
    try{
        if(!([0,1,2,3,4,5].includes(req.body.quality))) { return res.status(400).json({ err: 'Quality has an unexpected value'});}
        if(!getDeckById(req.params.did)) { return res.status(404).json({ err: 'Deck not found'});}
        if(req.body.card.id != req.params.cid) { return res.status(404).json({ err: 'Card IDs do not match'});}
        const result =  updateReview(req.params.cid, req.params.did, req.body.quality, req.body.card);
        if (!result) {
            return res.status(404).json({ error: 'Card not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to update the Card' });
    }
});


export default router;