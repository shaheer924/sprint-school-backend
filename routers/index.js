import express from "express";

const Route = express.Router()

import authentication from "./authentication.js";

Route.use('/auth', authentication)

export default Route