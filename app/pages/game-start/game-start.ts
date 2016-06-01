import {Page, NavController} from 'ionic-angular';
import {GameSetup} from '../game-setup/game-setup';

@Page({
    templateUrl: 'build/pages/game-start/game-start.html',
})

export class GameStart {

    constructor(private nav: NavController){
        this.nav = nav;
    }

    startSetup(modi: number){
        let modus = {
            modi: modi,
        };
        this.nav.push(GameSetup, modus);
    }
}