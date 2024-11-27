// Importa il modulo mongoose, necessario per definire schemi e modelli per MongoDB.
import mongoose from "mongoose";

/**
 * Schema per gli album del sistema.
 * Questo schema definisce la struttura dei documenti nella collezione "albums" del database.
 * @typedef {Object} Album
 * @property {String} title - Titolo dell'album.
 * @property {String} artist - Artista dell'album.
 * @property {String} imageUrl - URL dell'immagine dell'album.
 * @property {Number} releaseYear - Anno di rilascio dell'album.
 * @property {Array<ObjectId>} songs - Riferimenti alle canzoni incluse nell'album.
 * @property {Date} createdAt - Data di creazione del documento.
 * @property {Date} updatedAt - Data dell'ultimo aggiornamento del documento.
 */
const albumSchema = new mongoose.Schema(
    {
        /**
         * Titolo dell'album.
         * Tipo: Stringa
         * Obbligatorio: Sì
         * Trim: Rimuove spazi bianchi all'inizio e alla fine della stringa.
         * Validazione: Minimo 1 carattere, massimo 200 caratteri.
         */
        title: {
            type: String,
            required: [true, 'Il titolo dell\'album è obbligatorio'],
            trim: true,
            minlength: [1, 'Il titolo deve avere almeno 1 carattere'],
            maxlength: [200, 'Il titolo non può superare i 200 caratteri'],
        },

        /**
         * Artista dell'album.
         * Tipo: Stringa
         * Obbligatorio: Sì
         * Trim: Rimuove spazi bianchi all'inizio e alla fine della stringa.
         * Validazione: Minimo 1 carattere, massimo 100 caratteri.
         */
        artist: {
            type: String,
            required: [true, 'L\'artista dell\'album è obbligatorio'],
            trim: true,
            minlength: [1, 'L\'artista deve avere almeno 1 carattere'],
            maxlength: [100, 'L\'artista non può superare i 100 caratteri'],
        },

        /**
         * URL dell'immagine dell'album.
         * Tipo: Stringa
         * Obbligatorio: Sì
         * Validazione: Deve corrispondere a un URL valido di un'immagine (jpg, jpeg, png, gif).
         */
        imageUrl: {
            type: String,
            required: [true, 'L\'URL dell\'immagine dell\'album è obbligatorio'],
            match: [
                /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/,
                'L\'URL dell\'immagine non è valido. Deve essere un URL di un\'immagine (jpg, jpeg, png, gif)'
            ],
        },

        /**
         * Anno di rilascio dell'album.
         * Tipo: Numero
         * Obbligatorio: Sì
         * Validazione: Deve essere un numero intero compreso tra 1900 e l'anno corrente.
         */
        releaseYear: {
            type: Number,
            required: [true, 'L\'anno di rilascio dell\'album è obbligatorio'],
            min: [1900, 'L\'anno di rilascio deve essere a partire dal 1900'],
            max: [new Date().getFullYear(), 'L\'anno di rilascio non può essere nel futuro'],
        },

        /**
         * Riferimenti alle canzoni incluse nell'album.
         * Tipo: Array di ObjectId
         * Riferimento al modello "Song"
         * Obbligatorio: No (Un album può non avere canzoni al momento della creazione)
         */
        songs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Song",
        }]
    }, 
    {
        /**
         * Abilita la gestione automatica dei timestamp per ogni documento.
         * - createdAt: Data di creazione del documento.
         * - updatedAt: Data dell'ultimo aggiornamento del documento.
         */
        timestamps: true 
    }
);

/**
 * Metodo di istanza per ottenere una rappresentazione formattata dell'anno di rilascio.
 * @returns {String} - Anno di rilascio formattato.
 */
albumSchema.methods.getFormattedReleaseYear = function() {
    return this.releaseYear.toString();
};

/**
 * Metodo statico per trovare tutti gli album di un determinato artista.
 * @param {String} artistName - Nome dell'artista.
 * @returns {Promise<Array<Album>>} - Promessa risolta con un array di album.
 */
albumSchema.statics.findByArtist = function(artistName) {
    return this.find({ artist: artistName });
};

/**
 * Middleware 'pre-save' per capitalizzare il titolo dell'album prima di salvarlo nel database.
 */
albumSchema.pre('save', function(next) {
    if (this.title) {
        this.title = this.title.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }
    next();
});

/**
 * Middleware 'pre-remove' per eliminare le canzoni associate all'album prima di eliminarlo dal database.
 */
albumSchema.pre('remove', async function(next) {
    try {
        // Elimina tutte le canzoni associate a questo album
        await mongoose.model('Song').deleteMany({ albumId: this._id });
        next();
    } catch (error) {
        console.error("Errore nell'eliminazione delle canzoni associate all'album:", error);
        next(error);
    }
});

/**
 * Metodo di istanza per aggiungere una canzone all'album.
 * @param {ObjectId} songId - ID della canzone da aggiungere.
 * @returns {Promise<Album>} - Promessa risolta con l'album aggiornato.
 */
albumSchema.methods.addSong = async function(songId) {
    if (!this.songs.includes(songId)) {
        this.songs.push(songId);
        await this.save();
    }
    return this;
};

/**
 * Metodo di istanza per rimuovere una canzone dall'album.
 * @param {ObjectId} songId - ID della canzone da rimuovere.
 * @returns {Promise<Album>} - Promessa risolta con l'album aggiornato.
 */
albumSchema.methods.removeSong = async function(songId) {
    this.songs.pull(songId);
    await this.save();
    return this;
};

/**
 * Funzione per ottenere il `public_id` da un URL di Cloudinary.
 * @param {String} url - URL completo del file su Cloudinary.
 * @returns {String} - `public_id` necessario per l'eliminazione del file.
 */
const getPublicIdFromUrl = (url) => {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    const publicIdWithExtension = lastPart.split('.')[0]; // Rimuove l'estensione
    return `albums/${publicIdWithExtension}`; // Assicurati che il percorso corrisponda a come hai caricato l'immagine
};

/**
 * Middleware 'pre-remove' per eliminare l'immagine associata all'album su Cloudinary prima di eliminarlo dal database.
 */
albumSchema.pre('remove', async function(next) {
    try {
        const publicId = getPublicIdFromUrl(this.imageUrl);
        await cloudinary.uploader.destroy(publicId);
        next();
    } catch (error) {
        console.error("Errore nell'eliminazione dell'immagine su Cloudinary:", error);
        next(error);
    }
});

// Crea e esporta il modello Album basato sullo schema definito.
export const Album = mongoose.model("Album", albumSchema);
