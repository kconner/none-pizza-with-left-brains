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

    moveHero(id: string, movement: Movement) {
        var hero = this.heroes[id]

        if (movement.x < 0) {
            hero.facingDirection = 'Left'
        } else if (movement.x > 0) {
            hero.facingDirection = 'Right'
        }
        hero.x += movement.x * 10
        hero.y += movement.y * 10
    }
}
