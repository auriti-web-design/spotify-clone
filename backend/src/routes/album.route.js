// Importa il modulo Router da Express, necessario per creare router modulari separati.
import { Router } from "express";

// Crea una nuova istanza del router.
const router = Router();

/**
 * Definisce una rotta GET per l'endpoint root "/".
 * Quando viene effettuata una richiesta GET a questo endpoint,
 * il server risponde inviando un messaggio di conferma.
 *
 * @route GET /
 * @param {Object} req - L'oggetto richiesta HTTP.
 * @param {Object} res - L'oggetto risposta HTTP.
 */
router.get("/", (req, res) => {
    // Invia una risposta al client con un messaggio in italiano.
    res.send("Rotta degli album con metodo GET");
});

// Esporta il router in modo che possa essere utilizzato in altri file.
export default router;
