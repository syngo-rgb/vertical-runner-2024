import { MenuScene } from './scenes/Menu.js';
import { GameScene } from './scenes/Game.js';
import { PreloadScene } from './scenes/Preload.js';
import gameOptions from './utils/gameOptions.js'

const config = {
    type: Phaser.AUTO,
    width: gameOptions.width,
    height: gameOptions.height,
    backgroundColor: '#cecfc9', // Cambia el color de fondo
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [PreloadScene, MenuScene, GameScene]
};

// Check if a new tab is opened to restart the game
window.onfocus = function () {
    if (game.scene.isPaused('GameScene')) {
        game.scene.start('MenuScene');
    }
};

window.game = new Phaser.Game(config);

export default new Phaser.Game(config);