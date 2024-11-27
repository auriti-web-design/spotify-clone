// Importa il client di Clerk, necessario per interagire con il servizio di gestione utenti di Clerk.
import { clerkClient } from "@clerk/express";

/**
 * Middleware per proteggere le rotte che richiedono un utente autenticato.
 * Verifica se l'utente è autenticato controllando la presenza di `userId` nell'oggetto `auth` della richiesta.
 *
 * @param {Object} req - L'oggetto richiesta HTTP.
 * @param {Object} res - L'oggetto risposta HTTP.
 * @param {Function} next - La funzione callback per passare al middleware successivo.
 */
export const protectRoute = async (req, res, next) => {
    // Controlla se `userId` è presente nell'oggetto `auth` della richiesta.
    if (!req.auth.userId) {
        // Se `userId` non è presente, l'utente non è autenticato.
        // Risponde con uno status 401 (Unauthorized) e un messaggio di errore.
        return res.status(401).json({ message: "Non autorizzato - devi essere loggato" });
    }

    // Se l'utente è autenticato, passa al middleware successivo nella catena.
    next(); 
}

/**
 * Middleware per verificare se l'utente autenticato ha privilegi di amministratore.
 * Confronta l'email principale dell'utente con l'email dell'amministratore definita nelle variabili d'ambiente.
 *
 * @param {Object} req - L'oggetto richiesta HTTP.
 * @param {Object} res - L'oggetto risposta HTTP.
 * @param {Function} next - La funzione callback per passare al middleware successivo.
 */
export const requireAdmin = async (req, res, next) => {
    try {
        // Recupera i dettagli dell'utente corrente utilizzando `clerkClient` e l'ID utente presente nell'oggetto `auth`.
        const currentUser = await clerkClient.users.getUser(req.auth.userId);
        
        // Determina se l'utente corrente è l'amministratore confrontando la sua email con quella definita nelle variabili d'ambiente.
        const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

        if (!isAdmin) {
            // Se l'utente non è l'amministratore, risponde con uno status 403 (Forbidden) e un messaggio di errore.
            res.status(403).json({ message: "Accesso negato - devi essere un amministratore" });
            return;
        }

        // Se l'utente è un amministratore, passa al middleware successivo nella catena.
        next();
        
    } catch (error) {
        // Se si verifica un errore durante il recupero dei dettagli dell'utente, logga l'errore sulla console.
        console.error("Errore nel middleware requireAdmin: ", error);
        
        // Risponde con uno status 500 (Internal Server Error) e un messaggio di errore.
        res.status(500).json({ message: "Errore interno del server", error });
    }
}
