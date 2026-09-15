import Database, {type Database as dbType}  from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'srsdb.sqlite');



let db = new Database(DB_PATH);

function initializeDb(db: dbType): void {
    db.exec(`
        PRAGMA foreign_keys = ON;
        
        CREATE TABLE IF NOT EXISTS decks (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS cards (
            id INTEGER PRIMARY KEY,
            front TEXT,
            back TEXT,
            did INTEGER NOT NULL,
            reps INTEGER NOT NULL DEFAULT 0,
            factor REAL NOT NULL DEFAULT 2.5,
            ivl INTEGER NOT NULL DEFAULT 0,
            due INTEGER NOT NULL DEFAULT 0,
            type INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (did) REFERENCES decks(id) ON DELETE CASCADE
        );
    `);
}

// Make the error somewhat more functional
export function createDb(): void {
    try {
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
    } catch (err){
        console.error(err);
    }
}

// This doesn't look right
export function getDb(): dbType {
    createDb();
    if(!db){
        initializeDb(db);
    }
    return db;
}
