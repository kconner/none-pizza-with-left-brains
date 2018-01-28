import { Server } from 'colyseus'
import * as express from 'express'
import { createServer } from 'http'

import { Constants } from './config'
import { GameRoom } from './rooms'

const host = process.env.HOST || Constants.Connection.host
const port = Number(process.env.PORT || Constants.Connection.port)

// Create server stack
const app = express()
const httpServer = createServer(app)
const gameServer = new Server({ server: httpServer })

gameServer.register('GameRoom', GameRoom, {
    custom_options: 'this can be anything you want',
})

gameServer.listen(port, host)

console.log(`Listening on http://${host}:${port}`)
