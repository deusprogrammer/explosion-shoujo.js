import Phaser from 'phaser'

import config from '../config'

export default class Bomb extends Phaser.Sprite {
	constructor({ game, x, y, fuse, radius, parentState, owner }) {
		super(game, x, y, 'bomb')

		this.center = {}
    	this.block = {}
    	this.frameCount = 0

    	this.owner = owner
    	this.parentState = parentState
    	this.fuse = fuse
    	this.radius = radius

    	game.physics.arcade.enable(this)
	    this.body.setSize(config.BLOCK_SIZE - config.BB_ADJUST, config.BLOCK_SIZE - config.BB_ADJUST, config.BB_ADJUST/2, config.BB_ADJUST/2)
	    this.body.collideWorldBounds = true
	    this.body.immovable = true
	    this.body.checkCollision = {
	    	up: true,
	    	down: true,
	    	left: true,
	    	right: true
		}
	}

	update() {
		this.frameCount++

		if (this.frameCount >= this.fuse) {
			this.parentState.spawnExplosion(this.owner, this.x / config.BLOCK_SIZE, this.y / config.BLOCK_SIZE, this.radius)
			this.destroy()
		}
	}
}