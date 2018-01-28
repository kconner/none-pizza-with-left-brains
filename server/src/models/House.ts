import { MinionSpawner } from './MinionSpawner'

export class House implements MapPositionable {
    public static readonly RADIUS: number = 120

    id: string
    position = {
        x: 0,
        y: 0,
    }

    hp: number = 500
    team: Team = 'Human'
    minionSpawner: MinionSpawner

    constructor(team: Team, mapHouse: MapHouse, minionSpawnPoint: MapSpawnPoint) {
        this.team = team
        this.id = mapHouse.id
        this.position.x = mapHouse.position.x
        this.position.y = mapHouse.position.y
        this.minionSpawner = new MinionSpawner(team, minionSpawnPoint)
    }
}
