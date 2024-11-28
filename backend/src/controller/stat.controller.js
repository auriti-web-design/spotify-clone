// Importa i modelli necessari per recuperare le statistiche.
import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";

/**
 * Controller per recuperare le statistiche generali dell'applicazione.
 * @param {Object} req - L'oggetto della richiesta HTTP.
 * @param {Object} res - L'oggetto della risposta HTTP.
 * @param {Function} next - La funzione middleware per passare al middleware successivo in caso di errore.
 */
export const getStats = async (req, res, next) => {
    try {
        // Esegue le operazioni di conteggio parallele utilizzando Promise.all per migliorare le prestazioni.
        const [ totalSongs, totalUsers, totalAlbums, uniqueArtists ] = await Promise.all([
            Song.countDocuments(), // Conta il numero totale di canzoni.
            User.countDocuments(), // Conta il numero totale di utenti.
            Album.countDocuments(), // Conta il numero totale di album.
            // Calcola il numero di artisti unici combinando le raccolte "songs" e "albums".
            Song.aggregate([
                {
                    $unionWith: {
                        coll: "albums", // Unisce la raccolta "albums" alla raccolta corrente "songs".
                        pipeline: []
                    }
                },
                {
                    $group: {
                        _id: "$artist", // Raggruppa per il campo "artist".
                    }
                },
                {
                    $count: "count" // Conta il numero di gruppi unici.
                },
            ])
        ]);

        // Restituisce le statistiche calcolate con uno status 200 (OK).
        res.status(200).json({
            totalAlbums,
            totalSongs,
            totalUsers,
            uniqueArtists: uniqueArtists[0]?.count || 0, // Gestisce il caso in cui non ci siano artisti.
        });
    } catch (error) {
        // In caso di errore, passa l'errore al middleware di gestione degli errori.
        next(error);
    }
};
