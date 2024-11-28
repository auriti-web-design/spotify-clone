// Importa il modulo Router da Express, necessario per definire le rotte dell'applicazione.
import { Router } from "express";

// Importa le funzioni controller relative alle operazioni amministrative.
import { createSong, createAlbum, deleteSong, deleteAlbum, checkAdmin } from "../controller/admin.controller.js";

// Importa i middleware per la protezione delle rotte e la verifica dei privilegi di amministratore.
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

// Crea un'istanza del router Express, che consentirà di definire le rotte per le operazioni amministrative.
const router = Router();

// Applica i middleware `protectRoute` e `requireAdmin` a tutte le rotte definite successivamente.
// Questo assicura che solo gli utenti autenticati con privilegi di amministratore possano accedere a queste rotte.
router.use(protectRoute, requireAdmin);

/**
 * Rotta per verificare se l'utente corrente è un amministratore.
 * Metodo: POST
 * Endpoint: /api/admin/check
 * Middleware Applicati:
 *  - protectRoute: Verifica che l'utente sia autenticato.
 *  - requireAdmin: Verifica che l'utente abbia privilegi di amministratore.
 * Controller: checkAdmin
 */
router.post("/check", checkAdmin);

/**
 * Rotta per creare una nuova canzone.
 * Metodo: POST
 * Endpoint: /api/admin/songs
 * Middleware Applicati:
 *  - protectRoute: Verifica che l'utente sia autenticato.
 *  - requireAdmin: Verifica che l'utente abbia privilegi di amministratore.
 * Controller: createSong
 */
router.post("/songs", createSong);

/**
 * Rotta per eliminare una canzone esistente.
 * Metodo: DELETE
 * Endpoint: /api/admin/songs/:id
 * Parametri URL:
 *  - id: ID della canzone da eliminare.
 * Middleware Applicati:
 *  - protectRoute: Verifica che l'utente sia autenticato.
 *  - requireAdmin: Verifica che l'utente abbia privilegi di amministratore.
 * Controller: deleteSong
 */
router.delete("/songs/:id", deleteSong);

/**
 * Rotta per creare un nuovo album.
 * Metodo: POST
 * Endpoint: /api/admin/albums
 * Middleware Applicati:
 *  - protectRoute: Verifica che l'utente sia autenticato.
 *  - requireAdmin: Verifica che l'utente abbia privilegi di amministratore.
 * Controller: createAlbum
 */
router.post("/albums", createAlbum);

/**
 * Rotta per eliminare un album esistente.
 * Metodo: DELETE
 * Endpoint: /api/admin/albums/:id
 * Parametri URL:
 *  - id: ID dell'album da eliminare.
 * Middleware Applicati:
 *  - protectRoute: Verifica che l'utente sia autenticato.
 *  - requireAdmin: Verifica che l'utente abbia privilegi di amministratore.
 * Controller: deleteAlbum
 */
router.delete("/albums/:id", deleteAlbum);

// Esporta il router configurato per essere utilizzato nel file principale dell'applicazione.
export default router;
