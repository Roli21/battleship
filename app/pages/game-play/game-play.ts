import {Page, NavController, NavParams} from 'ionic-angular';
import {GameEnd} from '../game-end/game-end';

@Page({
    templateUrl: 'build/pages/game-play/game-play.html',
})

export class GamePlay {

    cells:Array<number> = [];
    chips:Array<any> = [];
    destroyedShips: number = 0;
    destroyedEnemyShips: number = 0;

    constructor(private params: NavParams, private nav: NavController){
        this.nav = nav;
        for (let i = 0; i < 100; i++) {
            this.cells.push(i);
        }
        for (let i = 0; i < params.data.ships.length; i++){
            let ship = params.data.ships[i];
            this.chips.push(ship);
            console.log("type: " + ship.type + " id: " + ship.id + " x: " + ship.x + " y: " + ship.y + " orientation: " + ship.orientation + " yx: " +ship.yx + " yx1: " +ship.yx1 + " yx2: " +ship.yx2 + " yx3: " +ship.yx3);
        }

    }

    initPlay(play: HTMLElement, id: number){
        let cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = 'cell-' + id;
        cell.style.height = '10%';
        cell.style.width = '10%';

        cell.addEventListener('touchend', () => {
            this.checkMove(cell, id);
        });
        play.appendChild(cell);
    }

    ngAfterContentInit(){
        var play = document.getElementById('play');
        let gameSize = play.clientWidth + 'px';
        play.style.width = gameSize;
        play.style.height = gameSize;

        for(let i = 0; i < 100; i++){
            this.initPlay(play, i);
        }
    }

    checkMove(cell: HTMLElement, id: number){
        if(this.cells.indexOf(id) != -1){
            //console.log("free space");
            this.cells.splice(this.cells.indexOf(id), 1);
            cell.style.background = '#ddd';
            cell.style.textAlign = 'center';
            cell.style.verticalAlign = 'middle';
            cell.innerHTML = '&nbsp';
            for(let i = 0; i < this.chips.length; i++){
                let chip = this.chips[i];
                if(!chip.state){
                    if(chip.yx == id && cell.style.background != 'red'){
                        cell.style.background = 'red';
                        chip.count += 1; }
                    if(chip.yx1 == id && cell.style.background != 'red'){
                        cell.style.background = 'red';
                        chip.count += 1; }
                    if(chip.yx2 == id && cell.style.background != 'red'){
                        cell.style.background = 'red';
                        chip.count += 1; }
                    if(chip.yx3 == id && cell.style.background != 'red'){
                        cell.style.background = 'red';
                        chip.count += 1; }
                    if(chip.count == chip.type){
                        console.log("kaputt:" + chip.id);
                        cell.style.background = 'red';
                        chip.state = true;
                        let shipElement = document.getElementById(chip.id);
                        shipElement.className += 'destroyed';
                        this.destroyedShips += 1;
                        if(this.destroyedShips == this.chips.length){
                            console.log("GAMEOVER");
                            let winner = {
                                player: 1,
                            };
                            this.nav.push(GameEnd, winner);
                        }
                    }
                }
            }
        } else {
            //console.log("taken space");
        }
    }
}