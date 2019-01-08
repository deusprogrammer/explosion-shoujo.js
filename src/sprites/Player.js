import Phaser from 'phaser'

import Bomb from './Bomb'

import config from '../config.js'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset, controls, parentState }) {
    super(game, x, y, asset)

    // Initializing variables
    this.center = {}
    this.block = {}
    this.direction = 'down'
    this.fuse = 180
    this.radius = 4

    this.bombsPlaced = 0
    this.maxBombs = 2

    this.controls = controls
    this.parentState = parentState

    // Add animations
    this.animations.add('up', [9, 10, 11], 5, true)
    this.animations.add('left', [3, 4, 5], 5, true)
    this.animations.add('right', [6, 7, 8], 5, true)
    this.animations.add('down', [0, 1, 2], 5, true)
    this.animations.add('die', [9, 3, 6, 0], 5, true)

    // Enable physics on this character
    game.physics.arcade.enable(this)
    this.body.setSize(config.BLOCK_SIZE - config.BB_ADJUST, config.BLOCK_SIZE - config.BB_ADJUST, config.BB_ADJUST/2, config.BB_ADJUST/2)
    this.body.collideWorldBounds = true
    this.body.checkCollision = {
    	up: true,
    	down: true,
    	left: true,
    	right: true
    }
  }

  update () {
	this.center.x = this.x + config.BLOCK_SIZE/2;
	this.center.y = this.y + config.BLOCK_SIZE/2;

	this.block.x = Math.floor(this.center.x / config.BLOCK_SIZE);
	this.block.y = Math.floor(this.center.y / config.BLOCK_SIZE);

	//  Reset the players velocity (movement)
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    let cursors = this.controls.cursors
    let bombButton = this.controls.bombButton

    if (cursors.left.isDown) {
        //  Move left
        this.body.velocity.x = -config.MOVEMENT_VELOCITY;

        this.animations.play('left');
        this.direction = "left";
    } else if (cursors.right.isDown) {
        //  Move right
        this.body.velocity.x = config.MOVEMENT_VELOCITY;

        this.animations.play('right');
        this.direction = "right";
    } else if (cursors.down.isDown) {
        //  Move down
        this.body.velocity.y = config.MOVEMENT_VELOCITY;

        this.animations.play('down');
        this.direction = "down";
    } else if (cursors.up.isDown) {
        //  Move up
        this.body.velocity.y = -config.MOVEMENT_VELOCITY;

        this.animations.play('up');
        this.direction = "up";
    } else {
        //  Stand still
        this.animations.stop();
    }

    if (this.controls.bombButtonPressed()) {
    	this.body.velocity.x = 0;
    	this.body.velocity.y = 0;

      if (this.bombsPlaced >= this.maxBombs) {
        return
      }

      this.bombsPlaced++

    	var bombBlock = this.getFacingBlock()
    	this.parentState.spawnBomb(this, bombBlock.x, bombBlock.y)
    }
  }

  adjustToCurrentBlock() {
	this.x = this.block.x * config.BLOCK_SIZE;
	this.y = this.block.y * config.BLOCK_SIZE;
  }

  getFacingBlock() {
  	var adjacentBlock = {};
    if (this.direction == "up") {
      adjacentBlock.x = this.block.x;
      adjacentBlock.y = this.block.y - 1;
    } else if (this.direction == "down") {
      adjacentBlock.x = this.block.x;
      adjacentBlock.y = this.block.y + 1;
    } else if (this.direction == "left") {
      adjacentBlock.x = this.block.x - 1;
      adjacentBlock.y = this.block.y;
    } else if (this.direction == "right") {
      adjacentBlock.x = this.block.x + 1;
      adjacentBlock.y = this.block.y;
    }

    return adjacentBlock
  }

  findDeltaFromPassing() {
    var idealBlock = {center: {}};
    idealBlock.center.x = (this.block.x * config.BLOCK_SIZE) + config.BLOCK_SIZE/2;
    idealBlock.center.y = (this.block.y * config.BLOCK_SIZE) + config.BLOCK_SIZE/2;

    var delta = {};
    delta.x = Math.abs(this.center.x - idealBlock.center.x);
    delta.y = Math.abs(this.center.y - idealBlock.center.y);

    return delta;
  }

  kill() {
    this.animations.play("die")
  }
}
