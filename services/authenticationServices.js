// import User from "../models/User.js";
import jwt from 'jsonwebtoken'
// import constants from "../utils/Constants.js";

export const JwtSignature = (id) => {
    return jwt.sign({id},'RDNLoRk0O7DflvQSCfHaD3YiGT6ig8Pl', {
        expiresIn: '2d'
    })
}

export const JwtDecode = (token) => {
    return jwt.verify(token,'RDNLoRk0O7DflvQSCfHaD3YiGT6ig8Pl')
}

export const otpVerification = (otp, otpVerify) => {
    return otp === otpVerify;
}

