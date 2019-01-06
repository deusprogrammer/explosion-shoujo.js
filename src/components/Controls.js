import Phaser from 'phaser'

export default class Controls {
	constructor({game}) {
		this.cursors = game.input.keyboard.createCursorKeys();
    	this.bombButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
	}
}