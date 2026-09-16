export interface Deck {
    id: number;
    name: string;
}

export function createDeck(name: string) {
    return {
        id: Date.now(),
        name,
    }
}
//Rearrange the way decks are stored
//Decks can be stored as keys inside of a json file