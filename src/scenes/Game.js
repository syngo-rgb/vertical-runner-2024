// GameScene.js
import gameOptions from '../utils/gameOptions.js'; // Asegúrate de que la ruta sea correcta

export class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.background = this.add.tileSprite(400, 300, 800, 600, 'background');

        // Solo un sprite para el jugador
        this.player
            = this.physics.add.sprite(400, 550, 'fly').setScale(2.4);
        this.player.setCollideWorldBounds(true);

        this.obstacles = this.physics.add.group();
        this.time.addEvent({
            delay: 1000,
            callback: this.addObstacle,
            callbackScope: this,
            loop: true
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.startTime = new Date();

        // Usa this.player para la detección de colisiones
        this.physics.add.overlap(this.player, this.obstacles, this.gameOver, null, this);
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
        } else {
            this.player.setVelocityX(0);
        }

        // Scroll the background for parallax effect
        this.background.tilePositionY -= 2;

        // Update the timer
        this.elapsedTime = (new Date() - this.startTime) / 1000;
        this.add.text(10, 10, `Time: ${this.elapsedTime.toFixed(2)}s`, { fontSize: '16px', fill: '#000' });
    }
    addObstacle() {
        const obstacle = this.obstacles.create(Phaser.Math.Between(50, 750), -50, 'obstacle');
        obstacle.setVelocityY(200);
        obstacle.setCollideWorldBounds(true);
        obstacle.setImmovable(true);
    }

    gameOver() {
        this.physics.pause();
        const currentTime = this.elapsedTime;
        gameOptions.bestTime = Math.max(gameOptions.bestTime, currentTime);
        this.add.text(400, 300, `Game Over\nTime: ${currentTime.toFixed(2)}s\nBest Time: ${gameOptions.bestTime.toFixed(2)}s\nPress ENTER to Restart`, { fontSize: '32px', fill: '#000' }).setOrigin(0.5);
        this.input.keyboard.once('keydown-ENTER', () => {
            this.scene.restart();
        });
    }
}
