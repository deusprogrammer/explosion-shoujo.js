import Phaser from 'phaser'
import config from '../config.js'

export default class Level {
	constructor({game, levelConfig}) {
		this.levelConfig = levelConfig
		this.enableBody = true;

		this.blocks = game.add.group()

		this.breakableBlocks = {}

		for (var y = 0; y < this.levelConfig.blocksY; y++) {
			for (var x = 0; x < this.levelConfig.blocksX; x++) {
				if (this.levelConfig.tilemap[y][x] == "*") {
					var block = this.blocks.create(x * config.BLOCK_SIZE, y * config.BLOCK_SIZE, this.levelConfig.blockAsset);
					game.physics.arcade.enable(block)
					block.body.setSize(config.BLOCK_SIZE - config.BB_ADJUST, config.BLOCK_SIZE - config.BB_ADJUST,  config.BB_ADJUST/2,  - config.BB_ADJUST/2)
					block.body.immovable = true;
				} else 	if (this.levelConfig.tilemap[y][x] == "#") {
					var block = this.blocks.create(x * config.BLOCK_SIZE, y * config.BLOCK_SIZE, this.levelConfig.breakableAsset);
					
					this.breakableBlocks[x + "," + y] = block

					game.physics.arcade.enable(block)
					block.body.setSize(config.BLOCK_SIZE - config.BB_ADJUST, config.BLOCK_SIZE - config.BB_ADJUST,  config.BB_ADJUST/2,  - config.BB_ADJUST/2)
					block.body.immovable = true;
				}
			}
		}
	}

	getTile(x, y) {
		return this.levelConfig.tilemap[y][x]
	}

	clearTile(x, y) {
		this.levelConfig.tilemap[y][x] = ' '
	}

	isBlockPassable(x, y) {
		return x >= 0 && y >= 0 && x < this.levelConfig.blocksX && y < this.levelConfig.blocksY && this.getTile(x, y) === ' ' 
	}

	isBlockPassableAndNotBreakable(x, y) {
		return x >= 0 && y >= 0 && x < this.levelConfig.blocksX && y < this.levelConfig.blocksY && this.getTile(x, y) !== '*'
	}

	isBlockBreakable(x, y) {
		return this.getTile(x, y) === '#'
	}
}