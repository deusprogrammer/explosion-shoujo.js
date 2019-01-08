import Phaser from 'phaser'

import config from '../config'

export default class Bomb extends Phaser.Sprite {
	constructor({ game, x, y, fuse, radius, parentState, owner }) {
		super(game, x, y, 'bomb')

		this.center = {}
    	this.block = {}
    	this.frameCount = 1

    	this.owner = owner
    	this.parentState = parentState
    	this.fuse = fuse
    	this.radius = radius

    	this.blockX = this.x/config.BLOCK_SIZE
    	this.blockY = this.y/config.BLOCK_SIZE

    	this.anchor.setTo(0.5)
    	this.x += Math.round(this.width * 0.5)
    	this.y += Math.round(this.height * 0.5)

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
		let scale = (0.25) * Math.sin((this.frameCount/(4*this.fuse)) * this.frameCount) + 0.75
		this.scale.setTo(scale, scale)

		this.frameCount++

		if (this.frameCount >= this.fuse) {
			this.parentState.spawnExplosion(this.owner, this.blockX, this.blockY, this.radius)
			this.owner.bombsPlaced--
			this.destroy()
		}
	}

	rgb2hex(r, g, b)  {	return r << 16 | g << 8 | b }
}