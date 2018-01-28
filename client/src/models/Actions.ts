export const movement = (x: Direction = 0, y: Direction = 0): Movement => {
    return {
        type: 'Movement',
        x: x,
        y: y,
    }
}

export const attack = (): Attack => {
    return { type: 'Attack' }
}
