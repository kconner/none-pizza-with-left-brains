import 'p2';
import 'pixi';
import 'phaser';

import * as helloworld from './hello';

import Preloader from './states/preloader';
import Title from './states/title';

console.log(helloworld.greeting);
console.log(Phaser.ANGLE_DOWN);

class App extends Phaser.Game {
    constructor(config: Phaser.IGameConfig) {
        super(config);

        this.state.add('preloader', Preloader);
        this.state.add('title', Title);

        this.state.start('preloader');
    }
}

function startApp(): void {
    // There are a few more options you can set if needed, just take a look at Phaser.IGameConfig
    let gameConfig: Phaser.IGameConfig = {
        width: 1280,
        height: 720,
        renderer: Phaser.AUTO,
        parent: '',
        resolution: 1,
    };

    let app = new App(gameConfig);
}

window.onload = () => {
    startApp();
};
