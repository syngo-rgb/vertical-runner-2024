// main.js
import gameOptions from '/home/user/vertical-runner-2024/utils/gameOptions.js';
import { PreloadScene } from './scenes/Preload.js';
import { MenuScene } from './scenes/Menu.js';
import { GameScene } from './scenes/Game.js';

const config = {
    type: Phaser.AUTO,
    width: gameOptions.width,
    height: gameOptions.height,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [PreloadScene, MenuScene, GameScene],
    parent: 'game-container'
};

new Phaser.Game(config);
