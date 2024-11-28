// Importa il modello Song dal file song.model.js
import { Song } from "../models/song.model.js";

/**
 * Controller per recuperare tutte le canzoni presenti nel database.
 * @param {Object} req - L'oggetto della richiesta HTTP.
 * @param {Object} res - L'oggetto della risposta HTTP.
 * @param {Function} next - La funzione middleware per passare al middleware successivo in caso di errore.
 */
export const getAllSongs = async (req, res, next) => {
    try {
        // Recupera tutte le canzoni dal database, ordinate per data di creazione decrescente.
        const songs = await Song.find().sort({ createAt: -1 });

        // Restituisce le canzoni trovate con uno status 200 (OK).
        res.status(200).json(songs);
    } catch (error) {
        // In caso di errore, passa l'errore al middleware di gestione degli errori.
        next(error);
    }
};

/**
 * Controller per recuperare un campione casuale di 6 canzoni per la sezione "Featured".
 * @param {Object} req - L'oggetto della richiesta HTTP.
 * @param {Object} res - L'oggetto della risposta HTTP.
 * @param {Function} next - La funzione middleware per passare al middleware successivo in caso di errore.
 */
export const getFeaturedSongs = async (req, res, next) => {
    try {
        // Utilizza l'aggregazione per recuperare un campione casuale di 6 canzoni.
        const songs = await Song.aggregate([
            {
                $sample: { size: 6 } // Seleziona 6 canzoni casuali.
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                },
            },
        ]);

        // Restituisce le canzoni trovate con uno status 200 (OK).
        res.status(200).json(songs);
    } catch (error) {
        // In caso di errore, passa l'errore al middleware di gestione degli errori.
        next(error);
    }
};

/**
 * Controller per recuperare un campione casuale di 4 canzoni per la sezione "Made for You".
 * @param {Object} req - L'oggetto della richiesta HTTP.
 * @param {Object} res - L'oggetto della risposta HTTP.
 * @param {Function} next - La funzione middleware per passare al middleware successivo in caso di errore.
 */
export const getMadeForYouSongs = async (req, res, next) => {
    try {
        // Utilizza l'aggregazione per recuperare un campione casuale di 4 canzoni.
        const songs = await Song.aggregate([
            {
                $sample: { size: 4 } // Seleziona 4 canzoni casuali.
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                },
            },
        ]);

        // Restituisce le canzoni trovate con uno status 200 (OK).
        res.status(200).json(songs);
    } catch (error) {
        // In caso di errore, passa l'errore al middleware di gestione degli errori.
        next(error);
    }
};

/**
 * Controller per recuperare un campione casuale di 4 canzoni per la sezione "Trending".
 * @param {Object} req - L'oggetto della richiesta HTTP.
 * @param {Object} res - L'oggetto della risposta HTTP.
 * @param {Function} next - La funzione middleware per passare al middleware successivo in caso di errore.
 */
export const getTrendingSongs = async (req, res, next) => {
    try {
        // Utilizza l'aggregazione per recuperare un campione casuale di 4 canzoni.
        const songs = await Song.aggregate([
            {
                $sample: { size: 4 } // Seleziona 4 canzoni casuali.
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                },
            },
        ]);

        // Restituisce le canzoni trovate con uno status 200 (OK).
        res.status(200).json(songs);
    } catch (error) {
        // In caso di errore, passa l'errore al middleware di gestione degli errori.
        next(error);
    }
};
