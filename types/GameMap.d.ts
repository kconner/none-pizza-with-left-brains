interface MapPositionable {
    position: {
        x: number
        y: number
    }
}

interface MapSpawnPoint extends MapPositionable {
    id: string
}

interface MapBase extends MapPositionable {
    id: string
    foodSpawnPointID: string
}

interface MapHouse extends MapPositionable {
    id: string
    spawnPointId: string
}

interface MapTeam {
    spawnPoints: MapSpawnPoint[]
    base: MapBase
    houses: MapHouse[]
}
interface GameMap {
    size: {
        width: number
        height: number
    }
    maximumTeamSize: number
    teams: { [id: string]: MapTeam }
}
