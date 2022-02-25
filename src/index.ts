import express, { Request, Response } from "express"
import cors from "cors"
import { routes } from "./routes"

const PORT = process.env.PORT || 8000
const app = express()
app.use(express.json())
app.use(
  cors({
    origin: ["localhost:3000"],
  })
)

routes(app)
app.get("/", (req: Request, res: Response) => {
  res.send("yay")
})
app.listen(PORT, () => console.log(`app started successfully on port:${PORT}`))
