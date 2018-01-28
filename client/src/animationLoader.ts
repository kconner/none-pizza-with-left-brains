type Animation = 'Stand' | 'Walk' | 'Attack' | 'Die'

export default class AnimationLoader {
    public static readonly WALK = 'walk'

    public loadSprite(game: Phaser.Game): void {
        game.load.spritesheet('myguy', 'walker.png', 48, 92)
    }

    public loadAnimations(game: Phaser.Game): Phaser.Sprite {
        let sprite: Phaser.Sprite = game.add.sprite(15, 30, 'myguy')

        const stand = sprite.animations.add('Stand', [54, 55], 3, false)
        stand.loop = true

        const walk = sprite.animations.add('Walk', [54, 55, 56, 57, 58, 59, 60, 61, 62], 10, false)
        walk.loop = true

        sprite.animations.add('Attack', [16, 32, 59, 29, 23], 10, false)

        sprite.animations.add('Die', [0, 9, 18, 27, 36], 10, false)

        return sprite
    }
}
