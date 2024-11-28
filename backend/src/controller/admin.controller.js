// Importa il modello Song dal file song.model.js presente nella cartella models.
import { Song } from '../models/song.model.js';

// Importa il modello Album dal file album.model.js presente nella cartella models.
import { Album } from '../models/album.model.js';

// Importa la configurazione di Cloudinary dal file cloudinary.js presente nella cartella lib.
import cloudinary from '../lib/cloudinary.js';

/**
 * Funzione asincrona per caricare un file su Cloudinary.
 * @param {Object} file - L'oggetto file da caricare.
 * @returns {string} - L'URL sicuro del file caricato.
 * @throws {Error} - Lancia un errore se il caricamento fallisce.
 */
const uploadToCloudinary = async (file) => {
    try {
        // Carica il file su Cloudinary utilizzando il percorso temporaneo del file.
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: 'auto', // Tipo di risorsa automatica (immagine, video, ecc.).
        });

        // Restituisce l'URL sicuro del file caricato.
        return result.secure_url;
    } catch (error) {
        // Log dell'errore nella console per il debug.
        console.error("Errore in uploadToCloudinary: ", error);
        // Lancia un nuovo errore per essere gestito a monte.
        throw new Error("Errore nel caricamento del file su Cloudinary");
    }
};

/**
 * Controller per creare una nuova canzone.
 * @param {Object} req - La richiesta HTTP.
 * @param {Object} res - La risposta HTTP.
 * @param {Function} next - La funzione per passare al middleware successivo.
 */
export const createSong = async (req, res, next) => {
    try {
        // Verifica se i file audio e immagine sono stati caricati nella richiesta.
        if (!req.files || !req.files.audioFile || !req.files.imageFile) {
            return res.status(400).json({ message: "Si prega di caricare tutti i file" });
        }

        // Estrae i campi dal corpo della richiesta.
        const { title, artist, albumId, duration } = req.body;
        const audioFile = req.files.audioFile;
        const imageFile = req.files.imageFile;

        // Carica il file audio su Cloudinary e ottiene l'URL.
        const audioUrl = await uploadToCloudinary(audioFile);
        // Carica il file immagine su Cloudinary e ottiene l'URL.
        const imageUrl = await uploadToCloudinary(imageFile);

        // Crea una nuova istanza del modello Song con i dati forniti.
        const song = new Song({
            title,
            artist,
            albumId: albumId || null, // Imposta albumId a null se non fornito.
            duration,
            audioUrl,
            imageUrl, // Aggiungi l'URL dell'immagine se necessario.
        });

        // Salva la nuova canzone nel database.
        await song.save();

        // Se è stato fornito un albumId, aggiorna l'album aggiungendo la nuova canzone.
        if (albumId) {
            await Album.findByIdAndUpdate(albumId, {
                $push: { songs: song._id } // Aggiunge l'ID della canzone all'array delle canzoni dell'album.
            });
        }

        // Restituisce la canzone creata con uno status 201 (Creato).
        res.status(201).json(song);
    } catch (error) {
        // Log dell'errore nella console per il debug.
        console.error("Errore in createSong: ", error);
        // Passa l'errore al middleware di gestione degli errori.
        next(error);
    }
};

/**
 * Controller per eliminare una canzone esistente.
 * @param {Object} req - La richiesta HTTP contenente l'ID della canzone da eliminare.
 * @param {Object} res - La risposta HTTP da inviare al client.
 * @param {Function} next - La funzione middleware per passare al middleware successivo in caso di errore.
 */
export const deleteSong = async (req, res, next) => {
    try {
        // Estrae l'ID della canzone dai parametri della richiesta.
        const { id } = req.params;

        // Trova la canzone per ID.
        const song = await Song.findById(id);

        if (!song) {
            return res.status(404).json({ message: "Canzone non trovata" });
        }

        // Se la canzone è associata a un album, rimuovi il riferimento dall'album.
        if (song.albumId) {
            await Album.findByIdAndUpdate(song.albumId, {
                $pull: { songs: song._id } // Rimuove l'ID della canzone dall'array delle canzoni dell'album.
            });
        }

        // Elimina la canzone dal database.
        await Song.findByIdAndDelete(id);

        // Restituisce una risposta di successo al client.
        res.status(200).json({ message: "Canzone eliminata con successo" });
    } catch (error) {
        // Log dell'errore nella console per il debug.
        console.error("Errore in deleteSong: ", error);
        // Passa l'errore al middleware di gestione degli errori.
        next(error);
    }
};

/**
 * Controller per creare un nuovo album.
 * @param {Object} req - La richiesta HTTP contenente i dati dell'album e i file caricati.
 * @param {Object} res - La risposta HTTP da inviare al client.
 * @param {Function} next - La funzione middleware per passare al middleware successivo in caso di errore.
 */
export const createAlbum = async (req, res, next) => {
    try {
        // Estrae i campi title, artist e releaseYear dal corpo della richiesta.
        const { title, artist, releaseYear } = req.body;

        // Estrae il file immagine (imageFile) dai file caricati nella richiesta.
        const { imageFile } = req.files;

        // Carica il file immagine su Cloudinary e ottiene l'URL sicuro dell'immagine.
        const imageUrl = await uploadToCloudinary(imageFile);

        // Crea una nuova istanza del modello Album con i dati forniti.
        const album = new Album({
            title,        // Titolo dell'album.
            artist,       // Artista dell'album.
            imageUrl,     // URL dell'immagine dell'album caricata su Cloudinary.
            releaseYear,  // Anno di rilascio dell'album.
        });

        // Salva il nuovo album nel database MongoDB.
        await album.save();

        // Restituisce la risposta al client con lo stato 201 (Creato) e i dati dell'album creato.
        res.status(201).json(album);
    } catch (error) {
        // Log dell'errore nella console per il debug.
        console.error("Errore in createAlbum: ", error);
        // Passa l'errore al middleware di gestione degli errori.
        next(error);
    }
};

/**
 * Controller per eliminare un album esistente.
 * @param {Object} req - La richiesta HTTP contenente i parametri dell'album da eliminare.
 * @param {Object} res - La risposta HTTP da inviare al client.
 * @param {Function} next - La funzione middleware per passare al middleware successivo in caso di errore.
 */
export const deleteAlbum = async (req, res, next) => {
    try {
        // Estrae l'ID dell'album dai parametri della richiesta.
        const { id } = req.params;

        // Trova l'album per ID.
        const album = await Album.findById(id);

        if (!album) {
            return res.status(404).json({ message: "Album non trovato" });
        }

        // Elimina tutte le canzoni associate all'album tramite il campo albumId.
        await Song.deleteMany({ albumId: id });

        // Elimina l'album dal database utilizzando il suo ID.
        await Album.findByIdAndDelete(id);

        // Restituisce la risposta al client con lo stato 200 (OK) e un messaggio di conferma.
        res.status(200).json({ message: "Album eliminato con successo" });
    } catch (error) {
        // Log dell'errore nella console per il debug.
        console.error("Errore in deleteAlbum: ", error);
        // Passa l'errore al middleware di gestione degli errori.
        next(error);
    }
};

/**
 * Controller per verificare se l'utente corrente è un amministratore.
 * Questo controller viene utilizzato per verifiche lato client se necessario.
 * @param {Object} req - La richiesta HTTP.
 * @param {Object} res - La risposta HTTP da inviare al client.
 */
export const checkAdmin = (req, res, next) => {
    res.status(200).json({ isAdmin: true }); // Restituisce true se l'utente è un amministratore.
};
