import AppState from './appState'

import HeroSprite from '../sprites/heroSprite'
import LifeBarSprite from '../sprites/lifeBarSprite'
import FogSprite from '../sprites/fogSprite'
import MiniMapSprite from '../sprites/miniMapSprite'
import HeroMiniMapSprite from '../sprites/heroMiniMapSprite'
import BaseMiniMapSprite from '../sprites/baseMiniMapSprite'
import HouseMiniMapSprite from '../sprites/houseMiniMapSprite'
import BaseSprite from '../sprites/baseSprite'
import HouseSprite from '../sprites/houseSprite'

export default class Preloader extends AppState {
    preload() {
        this.game.load.baseURL = './assets/'

        HeroSprite.loadAsset(this.game)
        LifeBarSprite.loadAsset(this.game)
        FogSprite.loadAsset(this.game)
        MiniMapSprite.loadAsset(this.game)
        HeroMiniMapSprite.loadAsset(this.game)
        BaseSprite.loadAsset(this.game)
        HouseSprite.loadAsset(this.game)
        BaseMiniMapSprite.loadAsset(this.game)
    }

    create() {
        // TODO: We eventually want to start on the title screen.
        // this.game.state.start('title')

        this.game.state.start('level')
    }
}
