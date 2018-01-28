import { Room, EntityMap, Client, nosync } from 'colyseus'

import { Hero, TimeOfDay, GameState } from '../models'

export class GameRoom extends Room<GameState> {
    onInit(options) {
        console.log('GameRoom.onInit', options)

        this.setState(new GameState())
        this.setPatchRate(16) // 60 fps
        this.setSimulationInterval(() => this.state.advanceFrame())
    }

    onJoin(client) {
        console.log('add client: ', client.id)

        this.state.createHero(client.id)
    }

    onLeave(client) {
        this.state.removeHero(client.id)
    }

    onMessage(client, data: ClientAction) {
        switch (data.type) {
            case 'Movement':
                const movement = data as Movement
                this.state.moveHero(client.id, movement)
                break

            case 'Attack':
                this.state.attackWithHero(client.id)
                break

            default:
                console.log('GameRoom.onMessage', client.id, data)
                break
        }
    }

    onDispose() {
        console.log('GameRoom.onDispose')
    }
}
