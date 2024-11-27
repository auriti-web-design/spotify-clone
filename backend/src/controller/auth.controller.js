import { User } from "../models/user.model.js";

export const authCallback = async (req, res, next) => {
    try {
        const { id, firstName, lastName, imageUrl } = req.body;

        const user = await User.findOne({ clerckId: id });

        if (!user) {
            await User.create({
                clirckId: id,
                fullName: `${firstName} ${lastName}`,
                imageUrl,
            })
        }

        res.status(200).json({ success: true })

    } catch (error) {
        console.log("Error in auth callBack: ", error);
        next(error);
    }
}