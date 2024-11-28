// Importa il modello Album dal file album.model.js
import { Album } from "../models/album.model.js";

/**
 * Controller per recuperare tutti gli album presenti nel database.
 * @param {Object} req - L'oggetto della richiesta HTTP.
 * @param {Object} res - L'oggetto della risposta HTTP.
 * @param {Function} next - La funzione middleware per passare al middleware successivo in caso di errore.
 */
export const getAllAlbums = async (req, res, next) => {
    try {
        // Recupera tutti gli album dal database, senza filtri.
        const albums = await Album.find({});

        // Restituisce gli album con uno status 200 (OK).
        res.status(200).json(albums);
    } catch (error) {
        // In caso di errore, passa l'errore al middleware di gestione degli errori.
        next(error);
    }
};

/**
 * Controller per recuperare un album specifico tramite il suo ID, inclusa la lista delle canzoni associate.
 * @param {Object} req - L'oggetto della richiesta HTTP.
 * @param {Object} res - L'oggetto della risposta HTTP.
 * @param {Function} next - La funzione middleware per passare al middleware successivo in caso di errore.
 */
export const getAlbumById = async (req, res, next) => {
    try {
        // Estrae l'ID dell'album dai parametri della richiesta.
        const { albumId } = req.params;

        // Cerca l'album nel database per ID e popola il campo "songs" con i dettagli delle canzoni associate.
        const album = await Album.findById(albumId).populate("songs");

        // Se l'album non viene trovato, restituisce uno status 404 (Non Trovato) con un messaggio di errore.
        if (!album) {
            return res.status(404).json({ message: "Album non trovato" });
        }

        // Restituisce l'album trovato con uno status 200 (OK).
        res.status(200).json(album);
    } catch (error) {
        // In caso di errore (ad esempio, ID non valido), passa l'errore al middleware di gestione degli errori.
        next(error);
    }
};
