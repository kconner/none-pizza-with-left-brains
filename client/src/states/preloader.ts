import AppState from './appState'

import HeroSprite from '../sprites/heroSprite'
import LifeBarSprite from '../sprites/lifeBarSprite'
import FogSprite from '../sprites/fogSprite'
import BaseSprite from '../sprites/baseSprite'

export default class Preloader extends AppState {
    preload() {
        this.game.load.baseURL = './assets/'

        HeroSprite.loadAsset(this.game)
        LifeBarSprite.loadAsset(this.game)
        FogSprite.loadAsset(this.game)
    }

    create() {
        // TODO: We eventually want to start on the title screen.
        // this.game.state.start('title')

        this.game.state.start('level')
    }
}
