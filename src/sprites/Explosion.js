import Phaser from 'phaser'

import config from '../config'

export default class Explosion extends Phaser.Sprite {
	constructor({ game, x, y, lifespan, radius, owner }) {
		super(game, x + (config.BLOCK_SIZE/2), y + (config.BLOCK_SIZE/2), 'explosion')

		this.center = {}
    	this.block = {}
    	this.frameCount = 0

    	this.owner = owner
    	this.lifespan = lifespan

    	this.anchor.setTo(0.5)

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
		this.rotation += 1
		this.frameCount++

		if (this.frameCount >= this.lifespan) {
			this.destroy()
		}
	}
}