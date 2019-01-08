import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#000000'
  }

  preload () {}

  create () {
    let splash = this.add.sprite(0, 0, 'game-over')
    splash.anchor.setTo(0.5)
    splash.x = 0.5 * config.gameWidth
    splash.y = 0.5 * config.gameHeight
  }

  update () {}
}