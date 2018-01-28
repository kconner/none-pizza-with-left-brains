import { EntityMap, nosync } from 'colyseus'

import { Constants } from '../config'
import { Hood01 } from '../maps'
import { TimeOfDay } from './TimeOfDay'
import { Base } from './Base'
import { Hero } from './Hero'
import { House } from './House'

export class GameState {
    map = Hood01
    heroes: EntityMap<Hero> = {}
    houses: EntityMap<House> = {}
    bases: EntityMap<Base> = {}

    timeOfDay: TimeOfDay = new TimeOfDay()

    @nosync humanHeroCount = 0
    @nosync zombieHeroCount = 0

    constructor() {
        const teams: Team[] = ['Human', 'Zombie']
        for (const team of teams) {
            this.createBaseForTeam(team)
            this.createHousesForTeam(team)
        }
    }

    get totalHeroCount() {
        return this.humanHeroCount + this.zombieHeroCount
    }

    createHero(id: string) {
        // Limit game heros to maximum team size * 2 teams
        if (this.totalHeroCount === this.map.maximumTeamSize * 2) {
            return
        }

        let team: Team
        if (this.humanHeroCount == this.zombieHeroCount) {
            team = Object.keys(this.heroes).length % 2 === 0 ? 'Human' : 'Zombie'
        } else if (this.humanHeroCount > this.zombieHeroCount) {
            team = 'Zombie'
        } else {
            team = 'Human'
        }

        const spawnPoints = this.map.teams[team].spawnPoints.filter(spawnPoint => spawnPoint.id.startsWith('hero'))
        let spawnPoint

        switch (team) {
            case 'Human':
                if (this.humanHeroCount < spawnPoints.length) {
                    spawnPoint = spawnPoints[this.humanHeroCount]
                    this.humanHeroCount += 1
                }
                break

            case 'Zombie':
                if (this.zombieHeroCount < spawnPoints.length) {
                    spawnPoint = spawnPoints[this.zombieHeroCount]
                    this.zombieHeroCount += 1
                }
                break
        }

        if (spawnPoint) {
            this.heroes[id] = new Hero(team, spawnPoint)
        } else {
            console.error(`Map is missing enough spawn points for defined team size (${this.map.maximumTeamSize}.`)
        }
    }

    private createBaseForTeam(team: Team) {
        const mapBase = this.map.teams[team].base
        this.bases[mapBase.id] = new Base(team, mapBase)
    }

    private createHousesForTeam(team: Team) {
        for (const mapHouse of this.map.teams[team].houses) {
            console.info(`GameState.createHousesForTeam<${team}>`, mapHouse)
            this.houses[mapHouse.id] = new House(team, mapHouse)
        }
    }

    removeHero(id: string) {
        const hero = this.heroes[id]

        switch (hero.team) {
            case 'Human':
                this.humanHeroCount -= 1
                break

            case 'Zombie':
                this.zombieHeroCount -= 1
                break
        }

        delete this.heroes[id]
    }

    moveHero(id: string, movement: Movement) {
        var hero = this.heroes[id]

        if (hero.activity === 'Dead') {
            return
        }

        if (movement.x < 0) {
            hero.facingDirection = 'Left'
        } else if (movement.x > 0) {
            hero.facingDirection = 'Right'
        }

        const dx: number = movement.x
        const dy: number = movement.y
        const length = Math.sqrt(dx * dx + dy * dy)
        if (length === 0) {
            hero.activity = 'Standing'
            return
        }

        const normalizedDx = dx / length
        const normalizedDy = dy / length
        hero.position.x = Math.max(0, Math.min(this.map.size.width, hero.position.x + normalizedDx * 12))
        hero.position.y = Math.max(0, Math.min(this.map.size.height, hero.position.y + normalizedDy * 12))
        hero.activity = 'Walking'
    }

    attackWithHero(id: string) {
        console.log('Attack! ' + id)
        const now = Date.now()
        var hero = this.heroes[id]

        if (hero.activity === 'Dead') {
            return
        }

        // Determine if we are attacking or cannot right now
        if (!hero.attackedAt) {
            hero.attackedAt = now
        } else if (now - hero.attackedAt >= Constants.Timeouts.heroAttack) {
            hero.attackedAt = now
        } else {
            return
        }

        // Hurt nearby heroes
        const doubleHeroRadius = Hero.RADIUS * 2
        const doubleHeroRadiusSquared = doubleHeroRadius * doubleHeroRadius
        for (const heroID of Object.keys(this.heroes)) {
            if (heroID === id) {
                continue
            }

            const opponent = this.heroes[heroID]
            if (opponent.activity === 'Dead') {
                continue
            }

            if (opponent.team === hero.team) {
                continue
            }

            const dx = opponent.position.x - hero.position.x
            const dy = opponent.position.y - hero.position.y
            const distanceSquared = dx * dx + dy * dy
            if (doubleHeroRadiusSquared < distanceSquared) {
                continue
            }

            opponent.hp = Math.max(0, opponent.hp - 25)

            if (opponent.hp === 0) {
                opponent.activity = 'Dead'
                opponent.diedAt = now
            }
        }

        for (const houseId of Object.keys(this.houses)) {
            const opponentHouse = this.houses[houseId]
            console.log('Checking house for attack: ' + opponentHouse)
            if (opponentHouse.hp <= 0) {
                continue
            }

            if (opponentHouse.team == hero.team) {
                continue
            }

            const heroHouseRadius = Hero.RADIUS + House.RADIUS
            const heroHouseRadiusSquared = heroHouseRadius * heroHouseRadius
            const dx = opponentHouse.position.x - hero.position.x
            const dy = opponentHouse.position.y - hero.position.y
            const distanceSquared = dx * dx + dy * dy
            if (heroHouseRadiusSquared < distanceSquared) {
                continue
            }

            console.log('Attacking house')
            opponentHouse.hp = Math.max(0, opponentHouse.hp - 25)
        }
    }

    advanceFrame() {
        this.advanceTimeOfDay()
        this.advanceRespawnTimers()
    }

    private advanceTimeOfDay() {
        this.timeOfDay.currentFrameTimestamp = Date.now() / 1000
        const frameDuration = this.timeOfDay.currentFrameTimestamp - this.timeOfDay.previousFrameTimestamp
        this.timeOfDay.dayCountdownInSeconds -= frameDuration

        if (this.timeOfDay.dayCountdownInSeconds <= 0) {
            // Dusk! Start counting down to next dusk.
            this.timeOfDay.dayCountdownInSeconds = TimeOfDay.lengthOfDayInSeconds
            this.timeOfDay.dayOrNight = 'Night'
            // send message to client that it is nighttime
        } else if (this.timeOfDay.dayCountdownInSeconds < TimeOfDay.lengthOfDayInSeconds / 2) {
            // Dawn!
            this.timeOfDay.dayOrNight = 'Day'
            // send message to client that it is daytime
        } else {
            // no changes needed (yet)
            // this will contain gradual change to lighting
        }

        this.timeOfDay.previousFrameTimestamp = this.timeOfDay.currentFrameTimestamp
    }

    private advanceRespawnTimers() {
        for (const heroID of Object.keys(this.heroes)) {
            const hero = this.heroes[heroID]
            if (hero.activity !== 'Dead') {
                continue
            }

            // Don't respawn until they have been dead for three seconds
            if (Date.now() < hero.diedAt + 3000) {
                continue
            }

            console.log('respawning')
            hero.respawn()
        }
    }
}
