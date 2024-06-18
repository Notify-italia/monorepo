const { MongoClient } = require('mongodb');
const fs = require('fs');
const { promisify } = require('util');

// Funzione asincrona per eseguire il backup delle collezioni
async function backupCollections() {
    const uri = 'mongodb://root:JwyvTwLVGocx@mongodb-develop.vps.notifyapp.it:27019/notify?authSource=admin'; // URI di connessione al tuo database MongoDB

    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
        await client.connect(); // Connessione al database
        const databaseNames = await client.db().admin().listDatabases(); // Ottieni elenco di tutti i database

        // Cicla su tutti i database ottenuti
        for (const dbInfo of databaseNames.databases) {
            const dbName = dbInfo.name;
            const db = client.db(dbName);

            // Ottieni elenco delle collezioni nel database corrente
            const collectionNames = await db.listCollections().toArray();

            // Cicla su tutte le collezioni ottenute
            for (const { name } of collectionNames) {
                const documents = await db.collection(name).find().toArray(); // Ottieni tutti i documenti dalla collezione

                const backupFileName = `${dbName}_${name}.json`;
                const backupFilePath = `./backup/${backupFileName}`; // Specifica il percorso dove salvare il file JSON (cartella "backup" nella directory corrente)

                // Scrivi i documenti della collezione in un file JSON
                await writeFileAsync(backupFilePath, JSON.stringify(documents, null, 4));

                console.log(`Backup della collezione ${name} del database ${dbName} completato. File salvato in: ${backupFilePath}`);
            }
        }

    } catch (error) {
        console.error('Si è verificato un errore durante il backup delle collezioni:', error);

    } finally {
        await client.close(); // Chiudi la connessione al database
    }
}

// Funzione di utilità per scrivere un file in modo asincrono
const writeFileAsync = promisify(fs.writeFile);

// Esegui la funzione per eseguire il backup delle collezioni
backupCollections();

