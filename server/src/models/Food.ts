import { v4 as uuid } from 'uuid'

export class Food implements MapPositionable {
    public static readonly RADIUS: number = 25

    id: string
    position = {
        x: 0,
        y: 0,
    }

    team: Team = 'Human'
    spawnedAt: number

    constructor(team: Team, spawnPoint: MapSpawnPoint, spawnedAt: number) {
        this.id = uuid()
        this.team = team
        this.position.x = spawnPoint.position.x
        this.position.y = spawnPoint.position.y
        this.spawnedAt = spawnedAt
    }
}
