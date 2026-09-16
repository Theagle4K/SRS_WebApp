import { type Deck, createDeck } from '../model/deck.ts'
import { getDb } from '../db/database.ts'

export function getAllDecks(): Deck[] {
    const db = getDb();
    return db.prepare(`SELECT id, name FROM decks ORDER BY rowid
    `).all() as Deck[];
}

export function getDeckById(id: number): Deck | undefined{
    const db = getDb();
    const deck = db.prepare('SELECT * FROM decks WHERE id = @id'        
    ).get({id: id}) as Deck;
    return deck ?? undefined;
}

export function addDeck(name: string): boolean {
    const db = getDb();
    const deck: Deck = createDeck(name);
    const results = db.prepare(`INSERT INTO decks (id, name) VALUES (@id, @name)
    `).run({
        id: deck.id,
        name: deck.name, 
    });
    return results.changes ? results.changes > 0 : false;
}

export function updateDeck(name: string, id: number): boolean {
    const db = getDb();
    const results = db.prepare(`UPDATE decks SET name = @name WHERE id = @id
    `).run({
        name: name,
        id: id,
    });
    return results.changes ? results.changes > 0 : false;
}

export function deleteDeck(id: number): boolean {
    const db = getDb();
    const results = db.prepare(`DELETE FROM decks WHERE id = @id
    `).run({id:id});
    return results.changes ? results.changes > 0 : false;
}