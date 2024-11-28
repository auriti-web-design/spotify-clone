// Importa il modulo `Router` da Express.
// `Router` consente di creare gruppi modulari di rotte, utili per organizzare meglio il codice.
import { Router } from "express";

// Importa i middleware per la protezione delle rotte.
import { protectRoute } from "../middleware/auth.middleware.js";

// Importa la funzione controller per recuperare tutti gli utenti.
import { getAllUsers } from "../controller/user.controller.js";

// Crea un'istanza del router.
// Questo router gestirà tutte le rotte relative agli utenti.
const router = Router();

/**
 * @route   GET /api/users/
 * @desc    Recupera tutti gli utenti presenti nel database, escludendo l'utente corrente.
 * @access  Protetto (richiede autenticazione)
 * @middleware
 *  - protectRoute: Verifica che l'utente sia autenticato.
 * @controller getAllUsers
 *
 * Esempio di richiesta:
 * GET http://localhost:5000/api/users/
 *
 * Risposta di successo:
 * 200 OK
 * [
 *   {
 *     "_id": "60d9f2f7b95e4c1f8c8b4567",
 *     "username": "john_doe",
 *     "email": "john@example.com",
 *     "createdAt": "2021-06-28T12:34:56.789Z",
 *     "updatedAt": "2021-06-28T12:34:56.789Z"
 *   },
 *   // ... altri utenti
 * ]
 */
router.get("/", protectRoute, getAllUsers);

// TODO: Aggiungere la rotta per recuperare i messaggi degli utenti (getMessages).

// Esporta il router come modulo predefinito.
// Questo consente di importarlo altrove e collegarlo al prefisso "/api/users".
export default router;
