// Importa il modulo Express, necessario per creare e gestire un server web.
import express from 'express';

// Importa il modulo dotenv per caricare variabili di ambiente da un file .env.
import dotenv from 'dotenv';

// Importa il middleware Clerk per gestire l'autenticazione tramite token.
import { clerkMiddleware } from '@clerk/express';

// Importa il middleware express-fileupload per consentire il caricamento di file.
import fileupload from 'express-fileupload';

// Importa il modulo path per manipolare i percorsi dei file.
import path from 'path';

// Importa la funzione di connessione al database MongoDB.
import { connectDB } from './lib/db.js';

// Importa i file di routing definiti per diverse entità del progetto.
import useRoutes from './routes/user.route.js';      // Rotte per la gestione degli utenti.
import adminRoutes from './routes/admin.route.js';    // Rotte per la gestione degli amministratori.
import authRoutes from './routes/auth.route.js';      // Rotte per l'autenticazione.
import songRoutes from './routes/song.route.js';      // Rotte per la gestione delle canzoni.
import albumRoutes from './routes/album.route.js';    // Rotte per la gestione degli album.
import statRoutes from './routes/stat.route.js';      // Rotte per statistiche o report.

// Configura dotenv per accedere alle variabili di ambiente definite nel file .env.
dotenv.config();

// Risoluzione del percorso assoluto del progetto.
const __dirname = path.resolve();

// Crea un'applicazione Express, che rappresenta il server web.
const app = express();

// Recupera il numero di porta dalle variabili di ambiente.
const PORT = process.env.PORT;

// Middleware per parse dei corpi delle richieste in formato JSON.
app.use(express.json());

// Middleware Clerk per la gestione dei token di autenticazione.
app.use(clerkMiddleware());

// Configura il middleware per il caricamento dei file.
app.use(fileupload({
    useTempFiles: true, // Utilizza file temporanei durante il caricamento.
    tempFileDir: path.join(__dirname, 'tmp'), // Directory temporanea per i file caricati.
    createParentPath: true, // Crea i percorsi genitori se non esistono.
    limits: {
        fileSize: 10 * 1024 * 1024, // Limite massimo per la dimensione di un file: 10 MB.
    },
}));

// Associa le rotte definite nei file di routing all'applicazione Express.
// Ogni prefisso definisce un endpoint base per quel gruppo di rotte.

// Rotte per gli utenti, accessibili tramite "/api/users".
app.use("/api/users", useRoutes);

// Rotte per le operazioni di autenticazione, accessibili tramite "/api/auth".
app.use("/api/auth", authRoutes);

// Rotte per funzionalità amministrative, accessibili tramite "/api/admin".
app.use("/api/admin", adminRoutes);

// Rotte per la gestione delle canzoni, accessibili tramite "/api/songs".
app.use("/api/songs", songRoutes);

// Rotte per la gestione degli album, accessibili tramite "/api/albums".
app.use("/api/albums", albumRoutes);

// Rotte per la visualizzazione o elaborazione delle statistiche, accessibili tramite "/api/stats".
app.use("/api/stats", statRoutes);

// Middleware per la gestione degli errori.
app.use((err, req, res, next) => {
    console.error(err.stack); // Stampa lo stack trace dell'errore nella console.
    res.status(500).json({ 
        message: process.env.NODE_ENV === "production" ? "Errore interno del server" : err.message
    }); // Restituisce un messaggio di errore in italiano.
});

// Avvia il server e stabilisce la connessione al database.
app.listen(PORT, () => {
    console.log('Il server è in esecuzione sulla porta ' + PORT); // Messaggio di conferma che il server è operativo.
    connectDB(); // Connessione al database MongoDB.
});
