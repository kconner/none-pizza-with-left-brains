import { Room, EntityMap, Client, nosync } from 'colyseus'

import { Player, GameState } from '../models'

export class GameRoom extends Room<GameState> {
    onInit(options) {
        console.log('GameRoom.onInit', options)

        this.setState(new GameState())
    }

    onJoin(client) {
        this.state.createPlayer(client.sessionId)
    }

    onLeave(client) {
        this.state.removePlayer(client.sessionId)
    }

    onMessage(client, data) {
        console.log('GameRoom.onMessage', client.sessionId, data)
        this.state.movePlayer(client.sessionId, data)
    }

    onDispose() {
        console.log('GameRoom.onDispose')
    }
}
