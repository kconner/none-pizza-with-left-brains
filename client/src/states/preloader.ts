import AppState from './appState'

export default class Preloader extends AppState {
    private thing: Phaser.Sprite

    preload() {
        this.game.load.baseURL = './assets/'

        this.game.load.image('thing', 'thing.png')
    }

    create() {
        // TODO: We eventually want to start on the title screen.
        // this.game.state.start('title')

        this.game.state.start('level')
    }
}
