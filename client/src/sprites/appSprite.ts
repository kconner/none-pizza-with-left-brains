import App from '../app'

export default class AppSprite extends Phaser.Sprite {
    app() {
        return this.game as App
    }
}
