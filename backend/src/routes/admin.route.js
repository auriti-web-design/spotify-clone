// Importa il modulo Router da Express, necessario per definire le rotte dell'applicazione.
import { Router } from "express";

// Importa le funzioni controller relative alle operazioni amministrative.
import { createSong, createAlbum, deleteSong, deleteAlbum } from "../controller/admin.controller.js";

// Importa i middleware per la protezione delle rotte e la verifica dei privilegi di amministratore.
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

// Crea un'istanza del router Express, che consentirà di definire le rotte per le operazioni amministrative.
const router = Router();

/**
 * Rotta per creare una nuova canzone.
 * Metodo: POST
 * Endpoint: /api/admin/songs
 * Middleware:
 *  - protectRoute: Verifica che l'utente sia autenticato.
 *  - requireAdmin: Verifica che l'utente abbia privilegi di amministratore.
 * Controller: createSong
 */
router.post("/songs", protectRoute, requireAdmin, createSong);

/**
 * Rotta per eliminare una canzone esistente.
 * Metodo: DELETE
 * Endpoint: /api/admin/songs/:id
 * Parametri URL:
 *  - id: ID della canzone da eliminare.
 * Middleware:
 *  - protectRoute: Verifica che l'utente sia autenticato.
 *  - requireAdmin: Verifica che l'utente abbia privilegi di amministratore.
 * Controller: deleteSong
 */
router.delete("/songs/:id", protectRoute, requireAdmin, deleteSong);

/**
 * Rotta per creare un nuovo album.
 * Metodo: POST
 * Endpoint: /api/admin/albums
 * Middleware:
 *  - protectRoute: Verifica che l'utente sia autenticato.
 *  - requireAdmin: Verifica che l'utente abbia privilegi di amministratore.
 * Controller: createAlbum
 */
router.post("/albums", protectRoute, requireAdmin, createAlbum);

/**
 * Rotta per eliminare un album esistente.
 * Metodo: DELETE
 * Endpoint: /api/admin/albums/:id
 * Parametri URL:
 *  - id: ID dell'album da eliminare.
 * Middleware:
 *  - protectRoute: Verifica che l'utente sia autenticato.
 *  - requireAdmin: Verifica che l'utente abbia privilegi di amministratore.
 * Controller: deleteAlbum
 */
router.delete("/albums/:id", protectRoute, requireAdmin, deleteAlbum);

// Esporta il router configurato per essere utilizzato nel file principale dell'applicazione.
export default router;
