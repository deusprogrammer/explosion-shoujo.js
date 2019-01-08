import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.image('game-over', 'assets/images/game-over.jpg')
    this.load.image('block', 'assets/images/block.png')
    this.load.image('breakable', 'assets/images/breakable.png')
    this.load.image('bomb', 'assets/images/bomb.png')
    this.load.image('explosion', 'assets/images/explosion.png')
    this.load.spritesheet('actor1', 'assets/images/actor1.png', 48, 48)
  }

  create () {
    this.state.start('Game')
  }
}
