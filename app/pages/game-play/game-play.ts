import {Page, NavController, NavParams} from 'ionic-angular';
import {GameEnd} from '../game-end/game-end';

@Page({
    templateUrl: 'build/pages/game-play/game-play.html',
})

export class GamePlay {

    cells:Array<number> = [];
    myCells:Array<number> = [];
    chips:Array<any> = [];
    comChips:Array<any> = [];
    destroyedShips: number = 0;
    destroyedEnemyShips: number = 0;

    constructor(private params: NavParams, private nav: NavController){
        this.nav = nav;
        for (let i = 0; i < 100; i++) {
            this.cells.push(i);
            this.myCells.push(i);
        }
        for (let i = 0; i < params.data.ships.length; i++){
            let ship = params.data.ships[i];
            this.chips.push(ship);
            console.log("type: " + ship.type + " id: " + ship.id + " x: " + ship.x + " y: " + ship.y + " orientation: " + ship.orientation + " yx: " +ship.yx + " yx1: " +ship.yx1 + " yx2: " +ship.yx2 + " yx3: " +ship.yx3);
        }
        //IF SINGLEPLAYER
        this.setComputerShips();

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

    initMyMap(myMap: HTMLElement, id: number){
        let cell = document.createElement('div');
        cell.className = 'myCell';
        cell.id = 'myCell-' + id;
        cell.style.height = '10%';
        cell.style.width = '10%';

        for(let i = 0; i < this.chips.length; i++){
            let ship = this.chips[i];
            if(id == ship.yx || id == ship.yx1 || id == ship.yx2 || id == ship.yx3){
                cell.style.background = 'rgba(107,235,28,.08)';
                cell.style.border = '1px solid #6beb1c';
            }
        };
        myMap.appendChild(cell);
    }

    setComputerShips(){
        let ship1 = { type: '1', id: 'enemyship-0', yx: '11', yx1: 'out', yx2: 'out', yx3: 'out', count: 0, state: false };
        let ship2 = { type: '2', id: 'enemyship-1', yx: '38', yx1: '48', yx2: 'out', yx3: 'out', count: 0, state: false };
        let ship3 = { type: '3', id: 'enemyship-2', yx: '32', yx1: '33', yx2: '34', yx3: 'out', count: 0, state: false };
        let ship4 = { type: '4', id: 'enemyship-3', yx: '85', yx1: '86', yx2: '87', yx3: '88', count: 0, state: false };
        let ship5 = { type: '3', id: 'enemyship-4', yx: '16', yx1: '17', yx2: '18', yx3: 'out', count: 0, state: false };
        let ship6 = { type: '2', id: 'enemyship-5', yx: '55', yx1: '65', yx2: 'out', yx3: 'out', count: 0, state: false };
        let ship7 = { type: '1', id: 'enemyship-6', yx: '72', yx1: 'out', yx2: 'out', yx3: 'out', count: 0, state: false };
        this.comChips.push(ship1,ship2,ship3,ship4,ship5,ship6,ship7);

        for(let i = 0; i < this.comChips.length; i++){
            let ship = this.comChips[i];
            console.log("comPos: " + " type: " + ship.type + " id: " + ship.id + " yx: " +ship.yx + " yx1: " +ship.yx1 + " yx2: " +ship.yx2 + " yx3: " +ship.yx3);
        };
    }

    ngAfterContentInit(){
        var play = document.getElementById('play');
        let gameSize = play.clientWidth + 'px';
        play.style.width = gameSize;
        play.style.height = gameSize;

        var myMap = document.getElementById('mymap');
        let myGameSize = myMap.clientWidth + 'px';
        myMap.style.width = myGameSize;
        myMap.style.height = myGameSize;

        for(let i = 0; i < 100; i++){
            this.initPlay(play, i);
            this.initMyMap(myMap, i);
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
            for(let i = 0; i < this.comChips.length; i++){
                let chip = this.comChips[i];
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
                        this.destroyedEnemyShips += 1;
                        if(this.destroyedEnemyShips == this.chips.length){
                            console.log("GAMEOVER");
                            let winner = {
                                player: 1,
                            };
                            this.nav.push(GameEnd, winner);
                        }
                    }
                }
            }
            this.computerMove();
        } else {
            //console.log("taken space");
        }
    }

    computerMove(){
        let move = false;
        while(!move){
            let id = Math.floor(Math.random() * 100);
            if(this.myCells.indexOf(id) != -1){
                this.myCells.splice(this.myCells.indexOf(id), 1);
                let myCell = document.getElementById('myCell-'+id);
                myCell.style.background = '#ddd';
                myCell.style.textAlign = 'center';
                myCell.style.verticalAlign = 'middle';
                myCell.innerHTML = '&nbsp';
                for(let i = 0; i < this.chips.length; i++){
                    let chip = this.chips[i];
                    if(!chip.state){
                        if(chip.yx == id && myCell.style.background != 'red'){
                            myCell.style.background = 'red';
                            chip.count += 1; }
                        if(chip.yx1 == id && myCell.style.background != 'red'){
                            myCell.style.background = 'red';
                            chip.count += 1; }
                        if(chip.yx2 == id && myCell.style.background != 'red'){
                            myCell.style.background = 'red';
                            chip.count += 1; }
                        if(chip.yx3 == id && myCell.style.background != 'red'){
                            myCell.style.background = 'red';
                            chip.count += 1; }
                        if(chip.count == chip.type){
                            console.log("com-kaputt:" + chip.id);
                            myCell.style.background = 'red';
                            chip.state = true;
                            this.destroyedShips += 1;
                            if(this.destroyedShips == this.chips.length){
                                console.log("GAMEOVER");
                                let winner = {
                                    player: 2,
                                };
                                this.nav.push(GameEnd, winner);
                            }
                        }
                    }
                }
                move = true;
            }
        }
    }
}