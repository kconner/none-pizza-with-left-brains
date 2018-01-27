import { Room, EntityMap, Client, nosync } from 'colyseus'

import { Hero, GameState } from '../models'

export class GameRoom extends Room<GameState> {
    onInit(options) {
        console.log('GameRoom.onInit', options)

        this.setState(new GameState())
    }

    onJoin(client) {
        console.log("add client: ", client.sessionId)

        this.state.createHero(client.sessionId)
    }

    onLeave(client) {
        this.state.removeHero(client.sessionId)
    }

    onMessage(client, data) {
        console.log('GameRoom.onMessage', client.sessionId, data)
        this.state.moveHero(client.sessionId, data)
    }

    onDispose() {
        console.log('GameRoom.onDispose')
    }
}
