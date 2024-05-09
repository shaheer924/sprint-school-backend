import appError from "../utils/AppError.js";
import jwt from 'jsonwebtoken'
import Users from "../models/Users.js";

export const authenticationMiddleware = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(" ")[1]
        }
        if (!token) return next(new appError("Token required", 401))

        let decode = await jwt.verify(token, 'RDNLoRk0O7DflvQSCfHaD3YiGT6ig8Pl')

        let userFind = await Users.findOne({_id: decode?.id})

        if (!userFind) return next(new appError("Unauthorized", 401))

        if(userFind?.isLoggedOut) return next(new appError("Please login again.", 401))

        req.user = userFind

        next();
    } catch (e) {
        return next(new appError(e?.message, 500))
    }
}