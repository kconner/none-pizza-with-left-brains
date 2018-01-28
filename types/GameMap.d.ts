interface SpawnPoint {
    id: string
    position: {
        x: number
        y: number
    }
}

interface GameTeam {
    spawnPoints: SpawnPoint[]
}

interface GameMap {
    size: {
        width: number
        height: number
    }
    teams: { [id: string]: GameTeam }
}
