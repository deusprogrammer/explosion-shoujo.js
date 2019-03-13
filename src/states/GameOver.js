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

    var text = "NOBODY WINS!  You're bad at this."
    if (this.game.winner) {
      text = this.game.winner.name + " wins!"
    }
    this.displayText(text)

    this.game.input.onDown.addOnce(this.restart, this);
  }

  restart() {
    this.state.start("Game")
  }

  update () {}

  displayText(text) {
    var style = { font: "32px Arial", fill: "#FFFFFF", align: "center" }

    var t = this.game.add.text(config.gameWidth/2, config.gameHeight/2, text, style)
    t.anchor.x = 0.5
    t.anchor.y = 0.5
    t.alpha = 1.0
  }
}