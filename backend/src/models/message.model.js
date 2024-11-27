// Importa il modulo mongoose, necessario per definire schemi e modelli per MongoDB.
import mongoose from "mongoose";

/**
 * Schema per i messaggi del sistema.
 * Questo schema definisce la struttura dei documenti nella collezione "messages" del database.
 * @typedef {Object} Message
 * @property {ObjectId} senderId - Riferimento all'ID dell'utente che invia il messaggio.
 * @property {ObjectId} receiverId - Riferimento all'ID dell'utente che riceve il messaggio.
 * @property {String} content - Contenuto del messaggio.
 * @property {Date} createdAt - Data di creazione del messaggio.
 * @property {Date} updatedAt - Data dell'ultimo aggiornamento del messaggio.
 */
const messageSchema = new mongoose.Schema(
    {
        /**
         * Riferimento all'ID dell'utente che invia il messaggio.
         * Tipo: ObjectId
         * Riferimento al modello "User"
         * Obbligatorio: Sì
         */
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, 'Il campo senderId è obbligatorio'],
        },

        /**
         * Riferimento all'ID dell'utente che riceve il messaggio.
         * Tipo: ObjectId
         * Riferimento al modello "User"
         * Obbligatorio: Sì
         */
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, 'Il campo receiverId è obbligatorio'],
        },

        /**
         * Contenuto del messaggio.
         * Tipo: Stringa
         * Obbligatorio: Sì
         */
        content: {
            type: String,
            required: [true, 'Il contenuto del messaggio è obbligatorio'],
            trim: true, // Rimuove spazi bianchi all'inizio e alla fine
            minlength: [1, 'Il contenuto del messaggio deve avere almeno 1 carattere'],
            maxlength: [1000, 'Il contenuto del messaggio non può superare i 1000 caratteri'],
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
 * Metodo di istanza per formattare la data di invio del messaggio.
 * @returns {String} - Data formattata in base alle preferenze locali.
 */
messageSchema.methods.getFormattedDate = function() {
    return this.createdAt.toLocaleString('it-IT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Metodo statico per trovare tutti i messaggi tra due utenti.
 * @param {ObjectId} userId1 - ID del primo utente.
 * @param {ObjectId} userId2 - ID del secondo utente.
 * @returns {Promise<Array<Message>>} - Promessa risolta con un array di messaggi tra i due utenti.
 */
messageSchema.statics.findMessagesBetweenUsers = function(userId1, userId2) {
    return this.find({
        $or: [
            { senderId: userId1, receiverId: userId2 },
            { senderId: userId2, receiverId: userId1 }
        ]
    }).sort({ createdAt: 1 }); // Ordina i messaggi per data di creazione crescente
};

/**
 * Middleware 'pre-save' per eseguire azioni prima di salvare un messaggio.
 * In questo caso, potresti implementare funzionalità come filtraggio dei contenuti inappropriati.
 */
messageSchema.pre('save', function(next) {
    // Esempio: Sanitizza il contenuto del messaggio per prevenire XSS
    this.content = sanitizeHtml(this.content);
    next();
});

// Funzione per sanitizzare l'HTML e prevenire attacchi XSS
import sanitizeHtml from 'sanitize-html';

// Importa il modello User per operazioni aggiuntive se necessario
import { User } from './user.model.js';

// Crea e esporta il modello Message basato sullo schema definito.
export const Message = mongoose.model("Message", messageSchema);
