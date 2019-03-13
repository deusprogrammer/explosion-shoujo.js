import Phaser from 'phaser'

export default class Controls {
	constructor({game, up, left, down, right, bomb}) {
		this.cursors = {
			up: game.input.keyboard.addKey(up),
			down: game.input.keyboard.addKey(down),
			left: game.input.keyboard.addKey(left),
			right: game.input.keyboard.addKey(right)
		}
    	this.bombButton = game.input.keyboard.addKey(bomb);
		this.buttonAlreadyPressed = false
		this.locked = false
	}

	bombButtonPressed() {
		if (!this.buttonAlreadyPressed && this.bombButton.isDown) {
			this.buttonAlreadyPressed = true
			return true
		} else if (this.buttonAlreadyPressed && this.bombButton.isUp) {
			this.buttonAlreadyPressed = false
			return false
		}
	}

	lock() {
		this.locked = true
	}
}