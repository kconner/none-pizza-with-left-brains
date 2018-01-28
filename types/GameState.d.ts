interface GameState {
    timeOfDay: TimeOfDay
    heroes: {
        [id: string]: Hero
    }
}
