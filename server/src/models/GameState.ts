import { EntityMap, nosync } from 'colyseus'

import { Player } from './Player'

export class GameState {
    players: EntityMap<Player> = {}

    @nosync something = "This attribute won't be sent to the client-side"

    createPlayer(id: string) {
        this.players[id] = new Player()
    }

    removePlayer(id: string) {
        delete this.players[id]
    }

    movePlayer(id: string, movement: any) {
        if (movement.x) {
            this.players[id].x += movement.x * 10
        } else if (movement.y) {
            this.players[id].y += movement.y * 10
        }
    }
}
