import { Server } from 'colyseus'
import * as express from 'express'
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

gameServer.listen(port)

console.log(`Listening on http://localhost:${port}`)
