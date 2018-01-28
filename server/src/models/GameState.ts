import { EntityMap, nosync } from 'colyseus'

import { Constants } from '../config'
import { Hood01 } from '../maps'
import { TimeOfDay } from './TimeOfDay'
import { Base } from './Base'
import { Hero } from './Hero'
import { House } from './House'
import { Minion } from './Minion'
import { Food } from './Food'
import { Actions } from '../models'


export class GameState {
    map = Hood01
    heroes: EntityMap<Hero> = {}
    houses: EntityMap<House> = {}
    bases: EntityMap<Base> = {}
    minions: EntityMap<Minion> = {}
    foods: EntityMap<Food> = {}

    timeOfDay: TimeOfDay = new TimeOfDay()

    winningTeam?: Team = null
    gameEndedAt?: number = null

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
        const teamBase = this.map.teams[team]
        const mapBase = this.map.teams[team].base
        this.bases[mapBase.id] = new Base(team, mapBase, teamBase)
    }

    private createHousesForTeam(team: Team) {
        for (const mapHouse of this.map.teams[team].houses) {
            console.info(`GameState.createHousesForTeam<${team}>`, mapHouse)

            // find spawn point based on spawnPointId from mapHouse
            const spawnPoints = this.map.teams[team].spawnPoints.filter(spawnPoint =>
                spawnPoint.id.startsWith(mapHouse.spawnPointId)
            )
            if (spawnPoints.length > 0) {
                // add a new house
                this.houses[mapHouse.id] = new House(team, mapHouse, spawnPoints[0])
            } else {
                console.error('Could not find spawn point for house ', mapHouse)
            }
        }
    }

    private createFood(team: Team, spawnPoint: MapSpawnPoint, spawnedAt: number) {
        console.log(`spawning food for ${team}`)
        const foodID = team
        this.foods[foodID] = new Food(foodID, team, spawnPoint, spawnedAt)
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

    removeMinion(id: string) {
        const minion = this.minions[id]
        delete this.heroes[id]
    }

    moveMinion(id: string, movement: Movement) {
        if (this.gameEndedAt) {
            return
        }

        var minion = this.minions[id]
        if (movement.x < 0) {
            minion.facingDirection = 'Left'
        } else if (movement.x > 0) {
            minion.facingDirection = 'Right'
        }
        const dx: number = movement.x
        const dy: number = movement.y
        const length = Math.sqrt(dx * dx + dy * dy)
        if (length === 0) {
            return
        }
        const normalizedDx = dx / length
        const normalizedDy = dy / length
        minion.position.x = Math.max(0, Math.min(this.map.size.width, minion.position.x + normalizedDx * 12))
        minion.position.y = Math.max(0, Math.min(this.map.size.height, minion.position.y + normalizedDy * 12))

    }

    moveHero(id: string, movement: Movement) {
        if (this.gameEndedAt) {
            return
        }

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

        if (!hero.carriedFoodID) {
            for (const foodID of Object.keys(this.foods)) {
                const food = this.foods[foodID]
                if (food.team !== hero.team) {
                    continue
                }

                const heroFoodRadius = Hero.RADIUS + Food.RADIUS
                const heroFoodRadiusSquared = heroFoodRadius * heroFoodRadius
                const dx = food.position.x - hero.position.x
                const dy = food.position.y - hero.position.y
                const distanceSquared = dx * dx + dy * dy
                if (heroFoodRadiusSquared < distanceSquared) {
                    continue
                }

                hero.carriedFoodID = foodID
                break
            }
        }

        if (hero.carriedFoodID) {
            const food = this.foods[hero.carriedFoodID]
            food.position.x = hero.position.x
            food.position.y = hero.position.y - 110

            for (const houseID of Object.keys(this.houses)) {
                const house = this.houses[houseID]
                if (house.team !== hero.team) {
                    continue
                }

                if (house.hp <= 0) {
                    continue
                }

                if (500 <= house.hp) {
                    continue
                }

                const heroHouseRadius = Hero.RADIUS + House.RADIUS
                const heroHouseRadiusSquared = heroHouseRadius * heroHouseRadius
                const dx = house.position.x - hero.position.x
                const dy = house.position.y - hero.position.y
                const distanceSquared = dx * dx + dy * dy
                if (heroHouseRadiusSquared < distanceSquared) {
                    continue
                }

                house.hp = Math.min(500, house.hp + 150)
                delete this.foods[hero.carriedFoodID]
                hero.carriedFoodID = null
            }
        }
    }

    attackWithHero(id: string) {
        if (this.gameEndedAt) {
            return
        }

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

        for (const baseId of Object.keys(this.bases)) {
            const opponentBase = this.bases[baseId]
            console.log('Checking base for attack: ' + opponentBase)
            if (opponentBase.hp <= 0) {
                continue
            }

            if (opponentBase.team == hero.team) {
                continue
            }

            const heroBaseRadius = Hero.RADIUS + Base.RADIUS
            const heroBaseRadiusSquared = heroBaseRadius * heroBaseRadius
            const dx = opponentBase.position.x - hero.position.x
            const dy = opponentBase.position.y - hero.position.y
            const distanceSquared = dx * dx + dy * dy
            if (heroBaseRadiusSquared < distanceSquared) {
                continue
            }

            console.log('Attacking base')
            opponentBase.hp = Math.max(0, opponentBase.hp - 25)
            if (opponentBase.hp === 0) {
                this.gameEndedAt = Date.now()
                this.winningTeam = hero.team
            }
        }

        for (const minionId of Object.keys(this.minions)) {
            const opponentMinion = this.minions[minionId]
            console.log('Checking minion for attack: ' + opponentMinion)
            if (opponentMinion.hp <= 0) {
                continue
            }

            if (opponentMinion.team == hero.team) {
                continue
            }

            const heroMinionRadius = Hero.RADIUS + Minion.RADIUS
            const heroMinionRadiusSquared = heroMinionRadius * heroMinionRadius
            const dx = opponentMinion.position.x - hero.position.x
            const dy = opponentMinion.position.y - hero.position.y
            const distanceSquared = dx * dx + dy * dy
            if (heroMinionRadiusSquared < distanceSquared) {
                continue
            }

            console.log('Attacking minion')
            opponentMinion.hp = Math.max(0, opponentMinion.hp - 25)

            if (opponentMinion.hp <= 0) {
                this.removeMinion(minionId)
            }
        }
    }

    advanceFrame() {
        this.advanceTimeOfDay()
        this.advanceRespawnTimers()
        this.advanceMinionSpawners()
        this.advanceFoodExpirationTimers()
        this.advanceFoodSpawnTimers()
        this.advanceMinionWalkers()
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

    private advanceFoodExpirationTimers() {
        // TODO
    }

    private advanceFoodSpawnTimers() {
        const now = Date.now()
        for (const baseID of Object.keys(this.bases)) {
            const base = this.bases[baseID]
            if (
                !(
                    (base.team === 'Human' && this.timeOfDay.dayOrNight === 'Night') ||
                    (base.team === 'Zombie' && this.timeOfDay.dayOrNight === 'Day')
                )
            ) {
                continue
            }

            let foodExistsForThisTeam = false
            for (const foodID of Object.keys(this.foods)) {
                const food = this.foods[foodID]
                if (food.team === base.team) {
                    foodExistsForThisTeam = true
                    break
                }
            }

            if (foodExistsForThisTeam) {
                continue
            }

            if (!base.spawnedFoodAt) {
                base.spawnedFoodAt = now
            } else if (now - base.spawnedFoodAt >= Constants.Timeouts.foodSpawn) {
                base.spawnedFoodAt = now
            } else {
                continue
            }

            this.createFood(base.team, base.foodSpawnPoint, now)
        }
    }

    public isGameEnded(): boolean {
        if (!this.gameEndedAt) {
            return false
        }

        if (Date.now() - this.gameEndedAt >= Constants.Timeouts.endOfGame) {
            return true
        }
    }

    private advanceMinionSpawners() {
        for (const houseID of Object.keys(this.houses)) {
            const house = this.houses[houseID]
            if (
                !(
                    (house.team === 'Human' && this.timeOfDay.dayOrNight === 'Day') ||
                    (house.team === 'Zombie' && this.timeOfDay.dayOrNight === 'Night')
                )
            ) {
                continue
            }

            const minionSpawner = house.minionSpawner
            if (Date.now() < minionSpawner.lastSpawn + minionSpawner.spawnIntervalInMilliseconds) {
                continue
            }
            const minion = minionSpawner.spawnNewMinion()
            this.minions[minion.id] = minion
        }
    }

    private advanceMinionWalkers() {
        for (const minionId of Object.keys(this.minions)) {

            let myMove: Movement = Actions.movement()
            let num: number = (Math.random() * 3);

            myMove.x = (num > 2) ? -1 : ((num < 1) ? 1 : 0)
            num = (Math.random() * 3);
            myMove.y = (num > 2) ? -1 : ((num < 1) ? 1 : 0)

            this.moveMinion(minionId, myMove)
            this.minionAttack(minionId)
        }
    }

    private minionAttack(minionId: string): void {

        const minion = this.minions[minionId]


        const minionRadius = 60;

        const now = Date.now()

        if (!minion.attackedAt) {
            minion.attackedAt = now
        } else if (now - minion.attackedAt >= Constants.Timeouts.heroAttack) {
            minion.attackedAt = now
        } else {
            return
        }

        for (const heroID of Object.keys(this.heroes)) {


            const opponent = this.heroes[heroID]
            if (opponent.activity === 'Dead') {
                continue
            }

            if (opponent.team === minion.team) {
                continue
            }

            const radius = minionRadius + Hero.RADIUS
            const radiusSquared = radius * radius
            const dx = opponent.position.x - minion.position.x
            const dy = opponent.position.y - minion.position.y
            const distanceSquared = dx * dx + dy * dy
            if (radiusSquared < distanceSquared) {
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

            if (opponentHouse.team == minion.team) {
                continue
            }

            const minionHouseRadius = Minion.RADIUS + House.RADIUS
            const heroHouseRadiusSquared = minionHouseRadius * minionHouseRadius
            const dx = opponentHouse.position.x - minion.position.x
            const dy = opponentHouse.position.y - minion.position.y
            const distanceSquared = dx * dx + dy * dy
            if (heroHouseRadiusSquared < distanceSquared) {
                continue
            }

            console.log('Attacking house')
            opponentHouse.hp = Math.max(0, opponentHouse.hp - 25)
        }

        for (const baseId of Object.keys(this.bases)) {
            const opponentBase = this.bases[baseId]
            console.log('Checking base for attack: ' + opponentBase)
            if (opponentBase.hp <= 0) {
                continue
            }

            if (opponentBase.team == minion.team) {
                continue
            }

            const heroBaseRadius = Minion.RADIUS + Base.RADIUS
            const heroBaseRadiusSquared = heroBaseRadius * heroBaseRadius
            const dx = opponentBase.position.x - minion.position.x
            const dy = opponentBase.position.y - minion.position.y
            const distanceSquared = dx * dx + dy * dy
            if (heroBaseRadiusSquared < distanceSquared) {
                continue
            }

            console.log('Attacking base')
            opponentBase.hp = Math.max(0, opponentBase.hp - 25)
            if (opponentBase.hp === 0) {
                this.gameEndedAt = Date.now()
                this.winningTeam = minion.team
            }
        }

        for (const minionId of Object.keys(this.minions)) {
            const opponentMinion = this.minions[minionId]
            console.log('Checking minion for attack: ' + opponentMinion)
            if (opponentMinion.hp <= 0) {
                continue
            }

            if (opponentMinion.team == minion.team) {
                continue
            }

            const heroMinionRadius = Minion.RADIUS + Minion.RADIUS
            const heroMinionRadiusSquared = heroMinionRadius * heroMinionRadius
            const dx = opponentMinion.position.x - minion.position.x
            const dy = opponentMinion.position.y - minion.position.y
            const distanceSquared = dx * dx + dy * dy
            if (heroMinionRadiusSquared < distanceSquared) {
                continue
            }

            console.log('Attacking minion')
            opponentMinion.hp = Math.max(0, opponentMinion.hp - 25)

            if (opponentMinion.hp <= 0) {
                this.removeMinion(minionId)
            }
        }
    }
}
