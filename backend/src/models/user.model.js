// Importa il modulo mongoose, necessario per definire schemi e modelli per MongoDB.
import mongoose from "mongoose";

/**
 * Schema per gli utenti del sistema.
 * @typedef {Object} User
 * @property {String} fullName - Nome completo dell'utente.
 * @property {String} imageUrl - URL dell'immagine dell'utente.
 * @property {String} clerckId - ID univoco fornito da Clerk.
 * @property {Date} createdAt - Data di creazione del documento.
 * @property {Date} updatedAt - Data dell'ultimo aggiornamento del documento.
 */
const userSchema = new mongoose.Schema(
    {
        /**
         * Nome completo dell'utente.
         * Tipo: Stringa
         * Obbligatorio: Sì
         * Minimale: 2 caratteri
         * Massimale: 100 caratteri
         */
        fullName: {
            type: String,
            required: [true, 'Il nome completo è obbligatorio'],
            minlength: [2, 'Il nome completo deve avere almeno 2 caratteri'],
            maxlength: [100, 'Il nome completo non può superare i 100 caratteri'],
            trim: true, // Rimuove spazi bianchi all'inizio e alla fine
        },

        /**
         * URL dell'immagine dell'utente.
         * Tipo: Stringa
         * Obbligatorio: Sì
         * Deve corrispondere al pattern di un URL valido per immagini
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
         * ID univoco fornito da Clerk per l'utente.
         * Utilizzato per l'autenticazione e l'autorizzazione.
         * Tipo: Stringa
         * Obbligatorio: Sì
         * Unicità: Ogni utente deve avere un clerckId unico.
         */
        clerckId: {
            type: String,
            required: [true, 'Il clerckId è obbligatorio'],
            unique: true,
            trim: true,
            validate: {
                validator: async function(value) {
                    // Verifica l'unicità del clerckId
                    const count = await mongoose.models.User.countDocuments({ clerckId: value });
                    return count === 0;
                },
                message: 'Il clerckId deve essere unico.'
            }
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
 * Middleware pre-save per formattare il nome completo.
 * Ad esempio, capitalizza il nome completo prima di salvarlo nel database.
 */
userSchema.pre('save', function(next) {
    if (this.fullName) {
        this.fullName = this.fullName.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }
    next();
});

/**
 * Metodo di istanza per ottenere il nome di visualizzazione dell'utente.
 * @returns {String} - Nome di visualizzazione formattato.
 */
userSchema.methods.getDisplayName = function() {
    return `${this.fullName} (${this.clerckId})`;
};

/**
 * Metodo statico per trovare un utente per clerckId.
 * @param {String} clerckId - ID univoco fornito da Clerk.
 * @returns {Promise<User>} - Promessa risolta con l'utente trovato o null.
 */
userSchema.statics.findByClerckId = function(clerckId) {
    return this.findOne({ clerckId });
};

// Crea e esporta il modello User basato sullo schema definito.
export const User = mongoose.model("User", userSchema);
