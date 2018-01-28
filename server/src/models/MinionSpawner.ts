import { Minion } from './Minion'

export class MinionSpawner {
    spawnIntervalInMilliseconds: number = 5000
    lastSpawn?: number
    position = {
        x: 0,
        y: 0,
    }
    team: Team

    constructor(team: Team, spawnPoint: MapSpawnPoint) {
        this.team = team
        this.position.x = spawnPoint.position.x
        this.position.y = spawnPoint.position.y
    }

    spawnNewMinion() {
        this.lastSpawn = Date.now()
        const minion = new Minion(this.team, this.position.x, this.position.y)
        console.info('spawn new minion ', minion.id)

        return minion
    }
}
