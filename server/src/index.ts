import { Server } from 'colyseus'
import * as path from 'path'
import * as express from 'express'
import * as serveIndex from 'serve-index'
import { createServer } from 'http'

import { GameRoom } from './rooms'

const port = Number(process.env.PORT || 2657)

// Create server stack
const app = express()
const httpServer = createServer(app)
const gameServer = new Server({ server: httpServer })

gameServer.register('GameRoom', GameRoom, {
    custom_options: 'this can be anything you want',
})

app.use(express.static(path.join(__dirname, 'static')))
app.use('/', serveIndex(path.join(__dirname, 'static'), { icons: true }))

gameServer.listen(port)

console.log(`Listening on http://localhost:${port}`)
