import express from "express"
import path from "path"
import {renderer} from "./renderer"

const PORT = 5000

const app = express()

app.use(express.static(path.join(__dirname, "..", "build"), {index: false}))

app.get("*", renderer)

app.listen(PORT, error => {
  if (error) {
    return console.error(error)
  }

  console.log("Listening on " + PORT + "...")
})
