export class Food implements MapPositionable {
    public static readonly RADIUS: number = 120

    id: string
    position = {
        x: 0,
        y: 0,
    }

    team: Team = 'Human'
    spawnedAt: number

    constructor(id: string, team: Team, spawnPoint: MapSpawnPoint, spawnedAt: number) {
        this.id = id
        this.team = team
        this.position.x = spawnPoint.position.x
        this.position.y = spawnPoint.position.y
        this.spawnedAt = spawnedAt
    }
}
