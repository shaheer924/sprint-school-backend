import express from 'express'
import morgan from "morgan";
import errorMiddleware from './middleware/errorMiddleware.js'
import routers from "./routers/index.js";
import appError from "./utils/AppError.js";
import connectDatabase from "./utils/Database.js";

function App() {
    const app = express()

    app.use(express.json())
    app.use(morgan('dev'))

    connectDatabase()

    app.use('/uploads', express.static('uploads'))
    app.use(express.static('views'))

    app.use('/api/v1/', routers)

    app.all('*', (req, res, next) => {
        return next(new appError("No Route found", 404))
    })
    app.use(errorMiddleware)
    return app;
}

export default App