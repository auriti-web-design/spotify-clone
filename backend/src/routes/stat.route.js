// Importa il modulo `Router` da Express.
// `Router` è una funzione che consente di creare un oggetto per gestire gruppi di rotte modulari.
import { Router } from "express";

// Importa i middleware per la protezione delle rotte e la verifica dei privilegi di amministratore.
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

// Importa la funzione controller per recuperare le statistiche.
import { getStats } from "../controller/stat.controller.js";

// Crea un'istanza di Router.
// Questo oggetto conterrà tutte le rotte specifiche per le statistiche.
const router = Router();

/**
 * @route   GET /api/stats/
 * @desc    Recupera le statistiche generali dell'applicazione, inclusi il numero totale di canzoni, utenti, album e artisti unici.
 * @access  Protetto (richiede autenticazione e privilegi di amministratore)
 * @middleware
 *  - protectRoute: Verifica che l'utente sia autenticato.
 *  - requireAdmin: Verifica che l'utente abbia privilegi di amministratore.
 * @controller getStats
 *
 * Esempio di richiesta:
 * GET http://localhost:5000/api/stats/
 *
 * Risposta di successo:
 * 200 OK
 * {
 *   "totalAlbums": 10,
 *   "totalSongs": 150,
 *   "totalUsers": 45,
 *   "uniqueArtists": 30
 * }
 */
router.get("/", protectRoute, requireAdmin, getStats);

// Esporta il router come modulo predefinito.
// Questo consente di importarlo altrove e associarlo a un prefisso specifico (es., "/api/stats").
export default router;
