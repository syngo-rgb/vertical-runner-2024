import gameOptions from '/home/user/vertical-runner-2024/utils/gameOptions.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
        this.controlsInverted = false;
        this.inversionTime = 10; // tiempo en segundos para invertir controles
        const savedBestTime = localStorage.getItem('bestTime');
        gameOptions.bestTime = savedBestTime ? parseFloat(savedBestTime) : 0;
    }


    create() {
        this.cameras.main.setBackgroundColor('#232221');
        this.player = this.physics.add.sprite(400, 550, 'fly').setScale(0.5); 
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

        // Mostrar tiempo
        this.timerText = this.add.text(10, 10, '', { fontSize: '16px', fill: '#000' });

        // Texto de aviso de inversión de controles
        this.inversionText = this.add.text(400, 50, '', {
            fontSize: '24px',
            fill: '#ff0000'
        }).setOrigin(0.5);

        // Invertir controles tras cierto tiempo
        this.time.delayedCall(this.inversionTime * 1000, () => {
            this.controlsInverted = true;
            this.inversionText.setText('¡Controles invertidos!');
        });

        this.physics.add.overlap(this.player, this.obstacles, this.gameOver, null, this);
    }

    update() {
        const elapsedTime = (new Date() - this.startTime) / 1000;
        this.elapsedTime = elapsedTime;
        this.timerText.setText(`Time: ${elapsedTime.toFixed(2)}s`);

        const speed = 200;

        // DEBUG opcional
        // console.log('Controles invertidos:', this.controlsInverted);

        if (this.controlsInverted) {
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(speed);
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(-speed);
            } else {
                this.player.setVelocityX(0);
            }
        } else {
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-speed);
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(speed);
            } else {
                this.player.setVelocityX(0);
            }
        }
    }

    addObstacle() {
        const obstacle = this.obstacles.create(Phaser.Math.Between(50, 750), -50, 'obstacle');
        obstacle.setVelocityY(200);
        obstacle.setCollideWorldBounds(true);
        obstacle.setImmovable(true);
    }

    gameOver() {
        this.physics.pause();
        gameOptions.bestTime = Math.max(gameOptions.bestTime, currentTime);
        localStorage.setItem('bestTime', gameOptions.bestTime);
        this.add.text(400, 300, 
            `Game Over\nTime: ${currentTime.toFixed(2)}s\nBest Time: ${gameOptions.bestTime.toFixed(2)}s\nPress ENTER to Restart`, 
            { fontSize: '32px', fill: '#000', align: 'center' }).setOrigin(0.5);

        this.input.keyboard.once('keydown-ENTER', () => {
            this.scene.restart();
        });
    }
}
