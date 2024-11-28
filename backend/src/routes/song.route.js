// Importa il modulo `Router` da Express, necessario per creare router modulari separati.
import { Router } from "express";

// Importa le funzioni controller per la gestione delle canzoni.
import { getAllSongs, getFeaturedSongs, getMadeForYouSongs, getTrendingSongs } from "../controller/song.controller.js";

// Importa i middleware per la protezione delle rotte e la verifica dei privilegi di amministratore.
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

// Crea una nuova istanza del router.
const router = Router();

/**
 * @route   GET /api/songs/
 * @desc    Recupera tutte le canzoni presenti nel database.
 * @access  Protetto (richiede autenticazione e privilegi di amministratore)
 * @middleware
 *  - protectRoute: Verifica che l'utente sia autenticato.
 *  - requireAdmin: Verifica che l'utente abbia privilegi di amministratore.
 * @controller getAllSongs
 *
 * Esempio di richiesta:
 * GET http://localhost:5000/api/songs/
 *
 * Risposta di successo:
 * 200 OK
 * [
 *   {
 *     "_id": "60d9f2f7b95e4c1f8c8b4567",
 *     "title": "Song Title",
 *     "artist": "Artist Name",
 *     "duration": 210,
 *     "audioUrl": "https://res.cloudinary.com/yourcloud/video/upload/v1625000000/songs/song.mp3",
 *     "imageUrl": "https://res.cloudinary.com/yourcloud/image/upload/v1625000000/songs/song.jpg",
 *     "albumId": "60d9f3a8b95e4c1f8c8b4568",
 *     "createdAt": "2021-06-28T12:34:56.789Z",
 *     "updatedAt": "2021-06-28T12:34:56.789Z"
 *   },
 *   // ... altre canzoni
 * ]
 */
router.get("/", protectRoute, requireAdmin, getAllSongs);

/**
 * @route   GET /api/songs/featured
 * @desc    Recupera un campione casuale di 6 canzoni per la sezione "Featured".
 * @access  Pubblico
 * @controller getFeaturedSongs
 *
 * Esempio di richiesta:
 * GET http://localhost:5000/api/songs/featured
 *
 * Risposta di successo:
 * 200 OK
 * [
 *   {
 *     "_id": "60d9f2f7b95e4c1f8c8b4567",
 *     "title": "Featured Song",
 *     "artist": "Artist Name",
 *     "imageUrl": "https://res.cloudinary.com/yourcloud/image/upload/v1625000000/songs/song.jpg",
 *     "audioUrl": "https://res.cloudinary.com/yourcloud/video/upload/v1625000000/songs/song.mp3"
 *   },
 *   // ... altre canzoni
 * ]
 */
router.get("/featured", getFeaturedSongs);

/**
 * @route   GET /api/songs/made-for-you
 * @desc    Recupera un campione casuale di 4 canzoni per la sezione "Made for You".
 * @access  Pubblico
 * @controller getMadeForYouSongs
 *
 * Esempio di richiesta:
 * GET http://localhost:5000/api/songs/made-for-you
 *
 * Risposta di successo:
 * 200 OK
 * [
 *   {
 *     "_id": "60d9f2f7b95e4c1f8c8b4567",
 *     "title": "Personalized Song",
 *     "artist": "Artist Name",
 *     "imageUrl": "https://res.cloudinary.com/yourcloud/image/upload/v1625000000/songs/song.jpg",
 *     "audioUrl": "https://res.cloudinary.com/yourcloud/video/upload/v1625000000/songs/song.mp3"
 *   },
 *   // ... altre canzoni
 * ]
 */
router.get("/made-for-you", getMadeForYouSongs);

/**
 * @route   GET /api/songs/trending
 * @desc    Recupera un campione casuale di 4 canzoni per la sezione "Trending".
 * @access  Pubblico
 * @controller getTrendingSongs
 *
 * Esempio di richiesta:
 * GET http://localhost:5000/api/songs/trending
 *
 * Risposta di successo:
 * 200 OK
 * [
 *   {
 *     "_id": "60d9f2f7b95e4c1f8c8b4567",
 *     "title": "Trending Song",
 *     "artist": "Artist Name",
 *     "imageUrl": "https://res.cloudinary.com/yourcloud/image/upload/v1625000000/songs/song.jpg",
 *     "audioUrl": "https://res.cloudinary.com/yourcloud/video/upload/v1625000000/songs/song.mp3"
 *   },
 *   // ... altre canzoni
 * ]
 */
router.get("/trending", getTrendingSongs);

// Esporta il router in modo che possa essere utilizzato in altri file.
export default router;
