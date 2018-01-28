interface ClientAction {
    type: string
}

type Direction = -1 | 1 | 0

interface Movement extends ClientAction {
    type: 'Movement'
    x: Direction
    y: Direction
}

interface Attack extends ClientAction {
    type: 'Attack'
}
