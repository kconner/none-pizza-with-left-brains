interface GameState {
    timeOfDay: {
        timeOfDay: TimeOfDay
    }
    heroes: {
        [id: string]: Hero
    }
}
