import App from '../app'

export default class AppState extends Phaser.State {
    app() {
        return this.game as App
    }
}
