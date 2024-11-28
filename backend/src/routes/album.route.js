// Importa il modulo `Router` da Express, necessario per creare router modulari separati.
import { Router } from "express";

// Importa le funzioni controller per la gestione degli album.
import { getAllAlbums, getAlbumById } from "../controller/album.controller.js";

// Crea una nuova istanza del router.
const router = Router();

/**
 * @route   GET /api/albums/
 * @desc    Recupera tutti gli album presenti nel database.
 * @access  Pubblico
 * @returns {Array<Album>} - Restituisce un array di oggetti album.
 *
 * Esempio di richiesta:
 * GET http://localhost:5000/api/albums/
 *
 * Risposta di successo:
 * 200 OK
 * [
 *   {
 *     "_id": "60d9f2f7b95e4c1f8c8b4567",
 *     "title": "Album Title",
 *     "artist": "Artist Name",
 *     "releaseYear": 2021,
 *     "imageUrl": "https://res.cloudinary.com/yourcloud/image/upload/v1625000000/albums/album.jpg",
 *     "songs": [],
 *     "createdAt": "2021-06-28T12:34:56.789Z",
 *     "updatedAt": "2021-06-28T12:34:56.789Z"
 *   },
 *   // ... altri album
 * ]
 */
router.get("/", getAllAlbums);

/**
 * @route   GET /api/albums/:albumId
 * @desc    Recupera un album specifico per ID, inclusa la lista delle canzoni associate.
 * @access  Pubblico
 * @param   {string} albumId - L'ID dell'album da recuperare.
 * @returns {Album} - Restituisce un oggetto album con le canzoni popolate.
 *
 * Esempio di richiesta:
 * GET http://localhost:5000/api/albums/60d9f2f7b95e4c1f8c8b4567
 *
 * Risposta di successo:
 * 200 OK
 * {
 *   "_id": "60d9f2f7b95e4c1f8c8b4567",
 *   "title": "Album Title",
 *   "artist": "Artist Name",
 *   "releaseYear": 2021,
 *   "imageUrl": "https://res.cloudinary.com/yourcloud/image/upload/v1625000000/albums/album.jpg",
 *   "songs": [
 *     {
 *       "_id": "60d9f3a8b95e4c1f8c8b4568",
 *       "title": "Song Title",
 *       "artist": "Artist Name",
 *       "duration": 210,
 *       "audioUrl": "https://res.cloudinary.com/yourcloud/video/upload/v1625000000/songs/song.mp3",
 *       // ... altri campi della canzone
 *     },
 *     // ... altre canzoni
 *   ],
 *   "createdAt": "2021-06-28T12:34:56.789Z",
 *   "updatedAt": "2021-06-28T12:34:56.789Z"
 * }
 *
 * Risposta di errore se l'album non è trovato:
 * 404 Not Found
 * {
 *   "message": "Album non trovato"
 * }
 */
router.get("/:albumId", getAlbumById);

// Esporta il router per essere utilizzato nel file principale dell'applicazione.
export default router;
