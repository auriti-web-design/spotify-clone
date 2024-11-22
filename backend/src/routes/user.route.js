// Importa il modulo Router da Express.
// Router consente di creare gruppi modulari di rotte, utili per organizzare meglio il codice.
import { Router } from "express";

// Crea un'istanza del router.
// Questo router gestirà tutte le rotte relative agli utenti.
const router = Router();

// Definisce una rotta GET per il percorso radice del gruppo "/api/users".
// Questa è la rotta predefinita per gli utenti e risponde con un messaggio testuale.
// - `req` rappresenta la richiesta HTTP del client.
// - `res` rappresenta la risposta HTTP che il server invierà al client.
router.get("/", (req, res) => {
    // Risponde con un semplice messaggio di testo per indicare che la rotta è attiva.
    res.send("User route with GET method");
});

// Esporta il router come modulo predefinito.
// Questo consente di importarlo altrove e collegarlo al prefisso "/api/users".
export default router;
