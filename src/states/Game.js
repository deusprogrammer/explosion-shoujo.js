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
  init() { 
    this.stage.backgroundColor = '#00FF00'
  }

  preload() { }

  create() {
    // Start physics system
    this.physics.startSystem(Phaser.Physics.ARCADE)

    this.playerCount = 2

    this.currentLevel = new Level({
      game: this.game,
      levelConfig: levels['level1']
    })

    // Create controls
    this.controlsP1 = new Controls({
      game: this.game,
      up: Phaser.KeyCode.W,
      left: Phaser.KeyCode.A,
      down: Phaser.KeyCode.S,
      right: Phaser.KeyCode.D,
      bomb: Phaser.KeyCode.C
    })

    this.playerList = []

    // Add sprites
    this.player1 = new Player({
      game: this.game,
      parentState: this,
      controls: this.controlsP1,
      x: 0,
      y: 0,
      asset: 'actor1',
      name: 'Player 1'
    })

    // Create controls
    this.controlsP2 = new Controls({
      game: this.game,
      up: Phaser.KeyCode.I,
      left: Phaser.KeyCode.J,
      down: Phaser.KeyCode.K,
      right: Phaser.KeyCode.L,
      bomb: Phaser.KeyCode.M
    })

    // Add sprites
    this.player2 = new Player({
      game: this.game,
      parentState: this,
      controls: this.controlsP2,
      x: (this.currentLevel.levelConfig.blocksX - 1) * 48,
      y: 0,
      asset: 'actor4',
      name: 'Player 2'
    })

    this.playerList.push(this.player1)
    this.playerList.push(this.player2)

    this.game.add.existing(this.player1)
    this.game.add.existing(this.player2)
  }

  update() {
    for (var pi in this.playerList) {
      this.adjustForCollisions(this.playerList[pi], this.currentLevel)
    }

    if (this.playerCount === 1) {
      this.game.winner = this.playerList[0]
      this.game.winner.controls.lock()
      this.game.time.events.add(Phaser.Timer.SECOND * 2, () => {
        this.state.start("GameOver")
      }, this);
    }

    if (this.playerCount === 0) {
      this.game.time.events.add(Phaser.Timer.SECOND * 2, () => {
        this.state.start("GameOver")
      }, this);
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

      this.currentLevel.bombs.add(bomb)
    }
  }

  spawnExplosion(owner, x, y, radius) {
    var explosionOrigin = {x: x, y: y}
    var explosionRange = radius
    var explosionCoords = []
    var rt = "rt", up = "up", lf = "lf", dn = "dn"
    var maxRanges = {rt: 0, dn: 0, lf: 0, up: 0}

    var rtStopped = false, lfStopped = false, upStopped = false, dnStopped = false
    
    for (var i = 1; i < explosionRange; i++) {
        if (maxRanges[rt] == i - 1 && this.currentLevel.isBlockPassableAndNotBreakable(explosionOrigin.x + i, explosionOrigin.y) && !rtStopped) {
            maxRanges[rt] += 1
            explosionCoords.push({"x": explosionOrigin.x + i, "y": explosionOrigin.y})

            rtStopped = this.currentLevel.isBlockBreakable(explosionOrigin.x + i, explosionOrigin.y)
        }

        if (maxRanges[up] == i - 1 && this.currentLevel.isBlockPassableAndNotBreakable(explosionOrigin.x, explosionOrigin.y - i) && !upStopped) {
            maxRanges[up] += 1
            explosionCoords.push({"x": explosionOrigin.x, "y": explosionOrigin.y - i})

            upStopped = this.currentLevel.isBlockBreakable(explosionOrigin.x, explosionOrigin.y - i)
        }
        
        if (maxRanges[lf] == i - 1 && this.currentLevel.isBlockPassableAndNotBreakable(explosionOrigin.x - i, explosionOrigin.y) && !lfStopped) {
            maxRanges[lf] += 1
            explosionCoords.push({"x": explosionOrigin.x - i, "y": explosionOrigin.y})

            lfStopped = this.currentLevel.isBlockBreakable(explosionOrigin.x - i, explosionOrigin.y)
        }
        
        if (maxRanges[dn] == i - 1 && this.currentLevel.isBlockPassableAndNotBreakable(explosionOrigin.x, explosionOrigin.y + i) && !dnStopped) {
            maxRanges[dn] += 1
            explosionCoords.push({"x": explosionOrigin.x, "y": explosionOrigin.y + i})

            dnStopped = this.currentLevel.isBlockBreakable(explosionOrigin.x, explosionOrigin.y + i)
        }
    }
    
    explosionCoords.push({"x": explosionOrigin.x, "y": explosionOrigin.y})
   
    var texts = []

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

      for (var pi in this.playerList) {
        var player = this.playerList[pi]

        // Check if a player was killed
        if (point.x === player.block.x && point.y === player.block.y) {
          this.playerCount--
          player.destroy()
          var text = player.name + " ate shit courtesy of " + owner.name

          if (player === owner) {
            text = player.name + " killed themselves like a dumbshit"
          }

          texts.push(text)
          this.playerList.splice(pi, 1)
        }
      }
    }

    if (this.playerCount === 0) {
        this.displayText("DOUBLE KO!")
      } else {
        this.displayTextChained(texts)
      }
  }

  adjustForCollisions(player, level) {
    var hitPlatform = this.game.physics.arcade.collide(player, level.blocks)
    var hitBomb = this.game.physics.arcade.collide(player, level.bombs)
    var adjacentBlock = player.getFacingBlock()

    // Check for obstacle collision
    if (hitPlatform && level.isBlockPassable(adjacentBlock.x, adjacentBlock.y)) {
      var delta = player.findDeltaFromPassing()

      var distance = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2))

      if (distance <= config.ALLOWED_DISTANCE) {
        player.adjustToCurrentBlock();
      }
    }

    // Check for bomb collisions
    if (hitBomb) {
      for (var i in level.bombs.children) {
        let bomb = level.bombs.children[i]

        // Check collision between current player and individual bombs
        if (bomb.checkBombCollision(player)) {
          var delta = player.findDeltaFromPassing()

          var distance = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2))

          if (distance <= config.ALLOWED_DISTANCE) {
            player.adjustToCurrentBlock();
          }
        }
      }
    }
  }

  displayText(text) {
    var style = { font: "32px Arial", fill: "#000000", align: "center", backgroundColor: "rgba(255, 255, 255, 1.0)" }

    var t = this.game.add.text(config.gameWidth/2, config.gameHeight/2, text, style)
    t.anchor.x = 0.5
    t.anchor.y = 0.5
    t.alpha = 1.0

    return this.game.add.tween(t).to( { alpha: 0 }, 1000, "Linear", true);
  }

  displayTextChained(texts) {
    var lastTween = null
    for (var i in texts) {
      var text = texts[i]
      var tween = this.displayText(text)

      if (lastTween) {
        tween.chain(lastTween)
      }

      lastTween = tween
    }
  }
}