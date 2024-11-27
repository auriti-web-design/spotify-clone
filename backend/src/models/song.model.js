// Importa il modulo mongoose, necessario per definire schemi e modelli per MongoDB.
import mongoose from "mongoose";

/**
 * Schema per le canzoni del sistema.
 * @typedef {Object} Song
 * @property {String} title - Titolo della canzone.
 * @property {String} artist - Artista della canzone.
 * @property {String} imageUrl - URL dell'immagine associata alla canzone.
 * @property {String} audioUrl - URL del file audio della canzone.
 * @property {Number} duration - Durata della canzone in secondi.
 * @property {ObjectId} albumId - Riferimento all'ID dell'album a cui appartiene la canzone.
 * @property {Date} createdAt - Data di creazione del documento.
 * @property {Date} updatedAt - Data dell'ultimo aggiornamento del documento.
 */
const songSchema = new mongoose.Schema(
    {
        /**
         * Titolo della canzone.
         * Tipo: Stringa
         * Obbligatorio: Sì
         */
        title: {
            type: String,
            required: [true, 'Il titolo della canzone è obbligatorio'],
            trim: true, // Rimuove spazi bianchi all'inizio e alla fine
        },

        /**
         * Artista della canzone.
         * Tipo: Stringa
         * Obbligatorio: Sì
         */
        artist: {
            type: String,
            required: [true, 'L\'artista della canzone è obbligatorio'],
            trim: true,
        },

        /**
         * URL dell'immagine associata alla canzone.
         * Tipo: Stringa
         * Obbligatorio: Sì
         * Deve corrispondere a un URL valido di un'immagine.
         */
        imageUrl: {
            type: String,
            required: [true, 'L\'URL dell\'immagine è obbligatorio'],
            match: [
                /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/,
                'L\'URL dell\'immagine non è valido'
            ],
        },

        /**
         * URL del file audio della canzone.
         * Tipo: Stringa
         * Obbligatorio: Sì
         * Deve corrispondere a un URL valido di un file audio.
         */
        audioUrl: {
            type: String,
            required: [true, 'L\'URL del file audio è obbligatorio'],
            match: [
                /^https?:\/\/.+\.(mp3|wav|flac)$/,
                'L\'URL del file audio non è valido'
            ],
        },

        /**
         * Durata della canzone in secondi.
         * Tipo: Numero
         * Obbligatorio: Sì
         * Deve essere un numero intero positivo.
         */
        duration: {
            type: Number,
            required: [true, 'La durata della canzone è obbligatoria'],
            min: [1, 'La durata deve essere almeno di 1 secondo'],
        },

        /**
         * Riferimento all'ID dell'album a cui appartiene la canzone.
         * Tipo: ObjectId
         * Riferimento al modello "Album"
         * Obbligatorio: No (le canzoni possono essere associate ad un album o rimanere indipendenti)
         */
        albumId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Album",
            required: false,
        }
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
 * Metodo di istanza per ottenere una rappresentazione formattata della durata della canzone.
 * @returns {String} - Durata formattata in formato MM:SS.
 */
songSchema.methods.getFormattedDuration = function() {
    const minutes = Math.floor(this.duration / 60);
    const seconds = this.duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Metodo statico per trovare tutte le canzoni di un determinato artista.
 * @param {String} artistName - Nome dell'artista.
 * @returns {Promise<Array<Song>>} - Promessa risolta con un array di canzoni.
 */
songSchema.statics.findByArtist = function(artistName) {
    return this.find({ artist: artistName });
};

/**
 * Middleware 'pre-save' che capitalizza il titolo della canzone prima di salvarlo nel database.
 */
songSchema.pre('save', function(next) {
    if (this.title) {
        this.title = this.title.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }
    next();
});

/**
 * Metodo di istanza per determinare se la canzone appartiene a un album.
 * @returns {Boolean} - True se la canzone appartiene ad un album, altrimenti False.
 */
songSchema.methods.belongsToAlbum = function() {
    return !!this.albumId;
};

// Crea e esporta il modello Song basato sullo schema definito.
export const Song = mongoose.model("Song", songSchema);
