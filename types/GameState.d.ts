interface GameState {
    timeOfDay: TimeOfDay
    world: World
    heroes: {
        [id: string]: Hero
    }
}
