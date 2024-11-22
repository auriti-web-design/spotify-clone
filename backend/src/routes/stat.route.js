// Importa il modulo Router da Express.
// Router è una funzione che consente di creare un oggetto per gestire gruppi di rotte modulari.
import { Router } from "express";

// Crea un'istanza di Router.
// Questo oggetto conterrà tutte le rotte specifiche per questa entità o funzionalità.
const router = Router();

// Definisce una rotta GET per il percorso radice ("/").
// Questa rotta risponde a una richiesta GET con un messaggio testuale.
// - `req` è l'oggetto della richiesta HTTP ricevuta dal server.
// - `res` è l'oggetto della risposta HTTP che verrà inviato al client.
router.get("/", (req, res) => {
    // Invia una risposta testuale con un messaggio che descrive la rotta.
    res.send("Stat route with GET method");
});

// Esporta il router come modulo predefinito.
// Questo consente di importarlo altrove e associarlo a un prefisso specifico (es., "/api/stats").
export default router;
