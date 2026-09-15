export interface Card {
    id: number, 
    front: string | null;
    back: string | null;
    did: number;
    reps: number;
    factor: number;
    ivl: number;
    due: number; 
    type: number; //0=new, 1=failed, 2=learned
}

export interface CreateCard {
    front: string | null;
    back: string | null;
}

export function createCard({front, back} : CreateCard, did: number): Card {
    return {
        id: Date.now(),
        front: front,
        back: back,
        did: did,
        reps: 0,
        factor: 2.5,
        ivl: 0,
        due: 0,
        type: 0
    }
}