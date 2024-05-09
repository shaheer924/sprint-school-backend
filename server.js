import App from "./app.js";
import dotenv from 'dotenv'

dotenv.config({path: './.env'})

const app = App()

const port = process.env.PORT || 5000
app.listen(port, ()=> {
    console.log(`Server is listening on port ${port}`)
})