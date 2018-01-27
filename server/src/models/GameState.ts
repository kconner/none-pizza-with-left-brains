import { EntityMap, nosync } from 'colyseus'

import { Hero } from './Hero'

export class GameState {
    heroes: EntityMap<Hero> = {}

    @nosync something = "This attribute won't be sent to the client-side"

    createHero(id: string) {
        this.heroes[id] = new Hero()
    }

    removeHero(id: string) {
        delete this.heroes[id]
    }

    moveHero(id: string, movement: any) {
        if (movement.x) {
            this.heroes[id].x += movement.x * 10
        } else if (movement.y) {
            this.heroes[id].y += movement.y * 10
        }
    }
}
