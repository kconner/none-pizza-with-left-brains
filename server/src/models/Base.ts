import { MinionSpawner } from './MinionSpawner'

export class Base implements MapPositionable {
    public static readonly RADIUS: number = 120

    id: string
    position = {
        x: 0,
        y: 0,
    }

    hp: number = 1500
    team: Team = 'Human'
    spawnedFoodAt?: number = null
    foodSpawnPoint: MapSpawnPoint

    minionSpawner: MinionSpawner

    constructor(team: Team, mapBase: MapBase, mapTeam: MapTeam) {
        this.team = team
        this.id = mapBase.id
        this.position.x = mapBase.position.x
        this.position.y = mapBase.position.y

        const spawnPoints = mapTeam.spawnPoints.filter(spawnPoint => spawnPoint.id === mapBase.foodSpawnPointID)
        if (spawnPoints.length !== 1) {
            return
        }

        this.foodSpawnPoint = spawnPoints[0]

        this.minionSpawner = new MinionSpawner(team, spawnPoints[0])
    }
}
