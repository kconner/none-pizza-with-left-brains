import AppState from './appState'

import HeroSprite from '../sprites/heroSprite'
import LifeBarSprite from '../sprites/lifeBarSprite'
import FogSprite from '../sprites/fogSprite'
import BaseSprite from '../sprites/baseSprite'
import HouseSprite from '../sprites/houseSprite'
import FoodSprite from '../sprites/foodSprite'

export enum Sounds {
    BASE_DESTROYED = 'base_destroyed',
    BASE_GETS_HIT = 'base_gets_hit',
    HERO_DIES = 'hero_dies',
    HOUSE_DESTRYOYED = 'house_destroyed',
    HOUSE_GETS_HIT = 'house_gets_hit',
    HUMAN_HERO_GETS_HIT = 'human_hero_gets_hit',
    HUMAN_MINION_GETS_HIT = 'human_minion_gets_hit',
    HUMAN_MINION_SPAWN = 'human_minion_spawn',
    MINION_DIES = 'minion_dies',
    ZOMBIE_HERO_GETS_HIT = 'zombie_hero_gets_hit',
    ZOMBIE_MINION_GETS_HIT = 'zombie_minion_gets_hit',
    ZOMBIE_MINION_SPAWN = 'zombie_minion_spawn',
}

export default class Preloader extends AppState {
    preload() {
        this.game.load.baseURL = './assets/'

        this.game.load.image('Pizza-Zombie-Game-Background', 'Pizza-Zombie-Game-Background.png')

        HeroSprite.loadAsset(this.game)
        LifeBarSprite.loadAsset(this.game)
        FogSprite.loadAsset(this.game)
        BaseSprite.loadAsset(this.game)
        HouseSprite.loadAsset(this.game)
        FoodSprite.loadAssets(this.game)

        this.loadSounds()
    }

    create() {
        // TODO: We eventually want to start on the title screen.
        // this.game.state.start('title')

        this.game.state.start('level')
    }

    loadSounds() {
        this.loadSound(Sounds.BASE_DESTROYED)
        this.loadSound(Sounds.BASE_GETS_HIT)
        this.loadSound(Sounds.HERO_DIES)
        this.loadSound(Sounds.HOUSE_DESTRYOYED)
        this.loadSound(Sounds.HOUSE_GETS_HIT)
        this.loadSound(Sounds.HUMAN_HERO_GETS_HIT)
        this.loadSound(Sounds.HUMAN_MINION_GETS_HIT)
        this.loadSound(Sounds.HUMAN_MINION_SPAWN)
        this.loadSound(Sounds.MINION_DIES)
        this.loadSound(Sounds.ZOMBIE_HERO_GETS_HIT)
        this.loadSound(Sounds.ZOMBIE_MINION_GETS_HIT)
        this.loadSound(Sounds.ZOMBIE_MINION_SPAWN)
    }

    loadSound(fileName: string) {
        this.game.load.audio(fileName, ['sounds/' + fileName + '.mp3', 'sounds/' + fileName + '.ogg'])
    }
}
