interface GameState {
    timeOfDay: TimeOfDay
    map: GameMap
    heroes: {
        [id: string]: Hero
    }
    winningTeam?: Team
}
