// Importa il modello User dal file user.model.js presente nella cartella models.
import { User } from "../models/user.model.js";

/**
 * Controller per recuperare tutti gli utenti presenti nel database, escludendo l'utente corrente.
 * @param {Object} req - L'oggetto della richiesta HTTP.
 * @param {Object} res - L'oggetto della risposta HTTP.
 * @param {Function} next - La funzione middleware per passare al middleware successivo in caso di errore.
 */
export const getAllUsers = async (req, res, next) => {
    try {
        // Ottiene l'ID dell'utente corrente dall'oggetto `auth` della richiesta.
        const currentUserId = req.auth.userId;

        // Recupera tutti gli utenti dal database escludendo l'utente corrente.
        const users = await User.find({ clerkId: { $ne: currentUserId } });

        // Restituisce gli utenti trovati con uno status 200 (OK).
        res.status(200).json(users);
    } catch (error) {
        // In caso di errore, passa l'errore al middleware di gestione degli errori.
        next(error);
    }
};
