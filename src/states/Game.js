/* globals __DEV__ */
import Phaser from 'phaser'

import Player from '../sprites/Player'
import Bomb from '../sprites/Bomb'
import Explosion from '../sprites/Explosion'

import Controls from '../components/Controls'
import Level from '../components/Level'

import config from '../config'
import levels from '../levels'

export default class extends Phaser.State {
  init() { }
  preload() { }

  create() {
    // Start physics system
    this.physics.startSystem(Phaser.Physics.ARCADE)

    this.playerCount = 1

    // Create controls
    this.controls = new Controls({
      game: this.game
    })

    // Add sprites
    this.player = new Player({
      game: this.game,
      parentState: this,
      controls: this.controls,
      x: 0,
      y: 0,
      asset: 'actor1'
    })

    this.currentLevel = new Level({
      game: this.game,
      levelConfig: levels['level1']
    })

    this.game.add.existing(this.player)
  }

  update() {
    this.adjustForCollisions(this.player, this.currentLevel)

    if (this.playerCount === 0) {
      console.log("GAME OVER")
      this.state.start("GameOver")
    }
  }

  spawnBomb(owner, x, y) {
    if (this.currentLevel.isBlockPassable(x, y)) {
      var bomb = new Bomb({
        x: x * config.BLOCK_SIZE,
        y: y * config.BLOCK_SIZE,
        game: this.game,
        fuse: owner.fuse,
        radius: owner.radius,
        owner: owner,
        parentState: this
      })

      this.currentLevel.blocks.add(bomb)
    }
  }

  spawnExplosion(owner, x, y, radius) {
    var explosionOrigin = {x: x, y: y}
    var explosionRange = radius
    var explosionCoords = []
    var rt = "rt", up = "up", lf = "lf", dn = "dn"
    var maxRanges = {rt: 0, dn: 0, lf: 0, up: 0}
    
    for (var i = 1; i < explosionRange; i++) {
        if (maxRanges[rt] == i - 1 && this.currentLevel.isBlockPassableAndNotBreakable(explosionOrigin.x + i, explosionOrigin.y)) {
            maxRanges[rt] += 1
            explosionCoords.push({"x": explosionOrigin.x + i, "y": explosionOrigin.y})
        }

        if (maxRanges[up] == i - 1 && this.currentLevel.isBlockPassableAndNotBreakable(explosionOrigin.x, explosionOrigin.y - i)) {
            maxRanges[up] += 1
            explosionCoords.push({"x": explosionOrigin.x, "y": explosionOrigin.y - i})
        }
        
        if (maxRanges[lf] == i - 1 && this.currentLevel.isBlockPassableAndNotBreakable(explosionOrigin.x - i, explosionOrigin.y)) {
            maxRanges[lf] += 1
            explosionCoords.push({"x": explosionOrigin.x - i, "y": explosionOrigin.y})
        }
        
        if (maxRanges[dn] == i - 1 && this.currentLevel.isBlockPassableAndNotBreakable(explosionOrigin.x, explosionOrigin.y + i)) {
            maxRanges[dn] += 1
            explosionCoords.push({"x": explosionOrigin.x, "y": explosionOrigin.y + i})
        }
    }
    
    explosionCoords.push({"x": explosionOrigin.x, "y": explosionOrigin.y})
   
    // Render each piece of the explosion
    for (i in explosionCoords) {
        var point = explosionCoords[i]
        var explosion = new Explosion({
          game: this.game,
          x: point.x * config.BLOCK_SIZE,
          y: point.y * config.BLOCK_SIZE,
          lifespan: 250
        })
        this.currentLevel.blocks.add(explosion)

        // Check if a block occupies the same block as this explosion
        let destroyedBlock = this.currentLevel.breakableBlocks[point.x + "," + point.y]
        if (destroyedBlock) {
          destroyedBlock.destroy()
          this.currentLevel.clearTile(point.x, point.y)
        }

        // Check if a player was killed
        if (point.x === this.player.block.x && point.y === this.player.block.y) {
          this.playerCount--
          this.player.kill()
        }
    }
  }

  adjustForCollisions(player, level) {
    var hitPlatform = this.game.physics.arcade.collide(player, level.blocks);
    var adjacentBlock = player.getFacingBlock()

    if (hitPlatform && level.isBlockPassable(adjacentBlock.x, adjacentBlock.y)) {
      var delta = player.findDeltaFromPassing()

      var distance = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2))

      if (distance <= config.ALLOWED_DISTANCE) {
        player.adjustToCurrentBlock();
      }
    }
  }
}