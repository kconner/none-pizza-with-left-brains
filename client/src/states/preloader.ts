import AppState from './appState'

export default class Preloader extends AppState {


    preload() {
        this.game.load.baseURL = './assets/'


    }

    create() {
        // TODO: We eventually want to start on the title screen.
        // this.game.state.start('title')

        this.game.state.start('level')
    }
}
