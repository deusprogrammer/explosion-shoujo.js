import Phaser from 'phaser'

export default class Controls {
	constructor({game}) {
		this.cursors = game.input.keyboard.createCursorKeys();
    	this.bombButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
		this.buttonAlreadyPressed = false
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
}