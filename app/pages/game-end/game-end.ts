import {Page, NavParams} from 'ionic-angular';

@Page({
    templateUrl: 'build/pages/game-end/game-end.html',
})

export class GameEnd {

    player: string;

    constructor(private params: NavParams){
        let player = params.data.player;
        console.log(player);
        if(player === 1){
            this.player = 'PLAYER 1';
        } else {
            this.player = 'PLAYER 2';
        }
    }

}
