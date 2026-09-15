import { type Card } from "../model/card.ts";

export function reviewCard(quality: number, card: Card): Card {
    const newCard = { ...card };

    if(quality >= 3){        
        switch(newCard.reps){
            case 0:
                newCard.reps = 1;
                break;
            case 1:
                newCard.reps = 6;
                break;
            default:
            newCard.ivl = Math.round(newCard.ivl * newCard.factor);
        }     
        newCard.reps++;
        newCard.type = 2;
        newCard.factor = (newCard.factor + (0.1 - (5 - quality) * (0.08 + (5 - quality ) * 0.02)));
    } else {
        newCard.reps = 0;
        newCard.ivl = 1;
        newCard.type = 1;
    }
    newCard.factor = newCard.factor < 1.3 ? 1.3 : newCard.factor;
    newCard.due = updateDue(newCard.ivl);  
    return newCard;
}

export function updateDue(int: number) : number {
    const newDue = new Date();
    return newDue.setDate(newDue.getDate() + int);
}