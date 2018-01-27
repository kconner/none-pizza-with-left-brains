import AppState from './appState'

export default class Preloader extends AppState {
    private thing: Phaser.Sprite

    public preload(): void {
        console.log('preloading preloader')

        this.game.load.baseURL = './assets/'

        this.game.load.image('thing', 'thing.png')
    }

    public create(): void {
        console.log('creating preloader')

        this.game.state.start('title')
    }
}
