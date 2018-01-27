import AppState from './appState'
import * as Colyseus from 'colyseus.js'

export default class Level extends AppState {
    public preload(): void {
        this.game.stage.backgroundColor = '#202020'
    }

    public create(): void {}

    public update(): void {}
}
