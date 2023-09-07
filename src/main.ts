import path from 'node:path'
import express from 'express'
import cors from 'cors'

const app = express()
const port = 1000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
// 配置静态文件目录
app.use(express.static(path.join(__dirname, 'folder')))

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

app.listen(port, () => {
  console.log(`Example app listening on port \x1B[34mhttp://127.0.0.1:${port}\x1B[0m`)
})

export default app
