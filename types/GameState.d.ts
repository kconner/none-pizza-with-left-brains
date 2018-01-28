interface GameState {
    world: World
    heroes: {
        [id: string]: Hero
    }
}
