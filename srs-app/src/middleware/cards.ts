import { type Card, type CreateCard, createCard } from '../model/card.ts';
import { reviewCard } from '../controller/card.ts';
import { getDb } from '../db/database.ts';

export function getAllCards(did: number): Card[] {
    const db = getDb();
    const cards = db.prepare('SELECT * FROM cards WHERE did = @did ORDER BY rowid').all({did: did}) as Card[];
    return cards;
}   

export function getCardById(did: number, id: number): Card | undefined {
    const db = getDb();
    const card = db.prepare('SELECT * FROM cards WHERE did = @did, id = @id'        
    ).get(
        {
        did: did,
        id: id
    }) as Card;
    return card ?? undefined; 
}

export function addCard(newCard: CreateCard, did: number): boolean {
    const db = getDb();
    const card: Card = createCard(newCard, did);
    const results = db.prepare(`
        INSERT INTO cards (id, front, back, did, reps, factor, ivl, due, type)
        VALUES (@id, @front, @back, @did, @reps, @factor, @ivl, @due, @type)
    `).run({
        id: card.id,
        front: card.front,
        back: card.back,
        did: card.did,
        reps: card.reps,
        factor: card.factor,
        ivl: card.ivl,
        due: card.due,
        type: card.type
    });
    return results.changes ? results.changes > 0 : false;
}

export function updateCard(id: number, did: number, newCard: CreateCard): boolean {
    const db = getDb();
    const results = db.prepare(`
        UPDATE cards SET front = @front, back = @back WHERE id = @id AND did = @did 
    `).run({
            front: newCard.front,
            back: newCard.back,
            id: id,
            did: did
    });
    return results.changes ? results.changes > 0 : false;
}

export function deleteCard(id: number, did: number):boolean {
    const db = getDb();
    const results = db.prepare(`
        DELETE FROM cards WHERE id = @id AND did = @did
        `).run({
            id: id,
            did: did
        });
    return results.changes ? results.changes > 0 : false;
}

export function updateReview(id: number, did: number, quality: number, card: Card): boolean {
    const db = getDb();
    const reviewedCard = reviewCard(quality, card);
    const results = db.prepare(`
        UPDATE cards SET reps = @reps, factor = @factor, ivl = @ivl, type = @type, due = @due WHERE id = @id AND did = @did 
    `).run({
            reps: reviewedCard.reps,
            factor: reviewedCard.factor,
            ivl: reviewedCard.ivl,
            type: reviewedCard.type,
            due: reviewedCard.due,
            id: id,
            did: did,
    });
    return results.changes ? results.changes > 0 : false;
}