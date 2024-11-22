// Importa il modulo Express, necessario per creare e gestire un server web.
import express from 'express';

// Importa il modulo dotenv per caricare variabili di ambiente da un file .env.
import dotenv from 'dotenv';

// Importa i file di routing definiti per diverse entità del progetto.
import useRoutes from './routes/user.route.js'; // Rotte per la gestione degli utenti.
import adminRoutes from './routes/admin.route.js'; // Rotte per la gestione degli amministratori.
import authRoutes from './routes/auth.route.js'; // Rotte per l'autenticazione.
import songRoutes from './routes/song.route.js'; // Rotte per la gestione delle canzoni.
import albumRoutes from './routes/album.route.js'; // Rotte per la gestione degli album.
import statRoutes from './routes/stat.route.js'; // Rotte per statistiche o report.

// Configura dotenv per accedere alle variabili di ambiente definite nel file .env.
dotenv.config();

// Crea un'applicazione Express, che rappresenta il server web.
const app = express();

// Recupera il numero di porta dalle variabili di ambiente.
// Se non definito, PORT sarà `undefined`, portando potenzialmente a errori.
const PORT = process.env.PORT;

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

// Avvia il server sull'indirizzo localhost e sulla porta specificata.
// Il callback di ascolto registra nel log un messaggio di conferma.
app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT); // Messaggio per confermare che il server è operativo.
});
