import 'p2'
import 'pixi'
import 'phaser'

import App from './app'

let app: App

window.onload = () => {
    // There are a few more options you can set if needed, just take a look at Phaser.IGameConfig
    let gameConfig: Phaser.IGameConfig = {
        width: 1280,
        height: 720,
        renderer: Phaser.AUTO,
        parent: 'game-container',
        resolution: 1,
    }

    app = new App(gameConfig)
}
