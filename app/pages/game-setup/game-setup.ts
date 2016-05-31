import {Page, NavController} from 'ionic-angular';
import {GamePlay} from '../game-play/game-play';
import * as interact from "interact.js";

@Page({
    templateUrl: 'build/pages/game-setup/game-setup.html',
})

export class GameSetup {

    cells:Array<number> = [];
    originX:number;
    originY:number;
    cellSize:number;
    shipCount:number = 0;

    constructor(private nav:NavController) {
        for (let i = 0; i < 100; i++) {
            this.cells.push(i);
        }
    }

    startGame() {
        console.log("startGame");
        let shipElements = document.getElementsByClassName('ship');
        let ships = [];
        for (let i = 0; i < shipElements.length; i++) {
            let shipElement = shipElements.item(i);
            //console.log(shipElement.get);
            let ship = {
                orientation: shipElement.classList.contains('rotate') ? 'vertical' : 'horizontal',
                type: shipElement.getAttribute('data-type'),
                id: 'ship-' + i,
                x: parseInt(shipElement.getAttribute('data-x')),
                y: parseInt(shipElement.getAttribute('data-y')),
                yx: shipElement.getAttribute('data-y') + shipElement.getAttribute('data-x'),
                yx1: 'out',
                yx2: 'out',
                yx3: 'out',
                count: 0,
                state: false,
            };

            if(ship.orientation == 'vertical'){
                ship.y += 1;
                ship.yx = (parseInt(ship.yx) + 10).toString();
            }

            if(ship.type == '2'){
                if(ship.orientation == 'horizontal') {
                    ship.yx1 = (parseInt(ship.yx) + 1).toString();
                } else {
                    ship.yx1 = (parseInt(ship.yx) + 10).toString();
                }
            } else if (ship.type == '3') {
                if(ship.orientation == 'horizontal') {
                    ship.yx1 = (parseInt(ship.yx) + 1).toString();
                    ship.yx2 = (parseInt(ship.yx1) + 1).toString();
                } else {
                    ship.yx1 = (parseInt(ship.yx) + 10).toString();
                    ship.yx2 = (parseInt(ship.yx1) + 10).toString();
                }
            } else if (ship.type == '4') {
                if(ship.orientation == 'horizontal') {
                    ship.yx1 = (parseInt(ship.yx) + 1).toString();
                    ship.yx2 = (parseInt(ship.yx1) + 1).toString();
                    ship.yx3 = (parseInt(ship.yx2) + 1).toString();
                } else {
                    ship.yx1 = (parseInt(ship.yx) + 10).toString();
                    ship.yx2 = (parseInt(ship.yx1) + 10).toString();
                    ship.yx3 = (parseInt(ship.yx2) + 10).toString();
                }
            }

            //console.log("type: " + ship.type + " x: " + ship.x + " y: " + ship.y + " orientation: " + ship.orientation);
            ships.push(ship);

        }

        this.nav.push(GamePlay, {
            ships: ships
        });

    }

    initShip(game:HTMLElement, type:number) {
        //console.log("initShip");
        let ship = document.createElement('div');
        ship.setAttribute('data-type', type.toString());
        ship.setAttribute('data-x', '0');
        ship.setAttribute('data-y', this.shipCount.toString());
        ship.className = 'ship ship-' + type;
        ship.style.height = this.cellSize + 'px';
        ship.style.width = (this.cellSize * type) + 'px';
        ship.style.left = '0px';
        ship.style.top = (this.cellSize * this.shipCount) + 'px';
        ship.style.transformOrigin = this.cellSize / 2 + 'px' + this.cellSize / 2 + 'px';

        ship.setAttribute('data-x', Math.round(parseFloat(ship.style.left) / this.cellSize).toString());
        ship.setAttribute('data-y', Math.round(parseFloat(ship.style.top) / this.cellSize).toString());

        game.appendChild(ship);
        this.shipCount++;
    }

    ngAfterContentInit() {
        console.log("afterContentInit");

        var game = document.getElementById('game');
        let gameSize = game.clientWidth + 'px';
        game.style.width = gameSize;
        game.style.height = gameSize;

        this.cellSize = game.clientWidth / 10;
        this.originX = game.getClientRects()[0].left;
        this.originY = game.getClientRects()[0].top;

        for (let i = 1; i <= 4; i++) {
            this.initShip(game, i);
        }

        for (let i = 3; i >= 1; i--) {
            this.initShip(game, i);
        }

        var elements = document.getElementsByClassName('ship'), x = this.originX, y = this.originY;
        for (let i = 0; i < elements.length; i++) {
            let element = elements.item(i);
            interact(element)
                .draggable({
                    restrict: {
                        restriction: "parent",
                        endOnly: true,
                        elementRect: {top: 0, left: 0, bottom: 1, right: 1}
                    },
                    inertia: true,
                    snap: {
                        targets: [
                            interact.createSnapGrid({
                                x: this.cellSize,
                                y: this.cellSize,
                                offset: {x: this.originX, y: this.originY}
                            })
                        ],
                        range: Infinity,
                        //relativePoints: [ { x: this.originX, y: this.originY } ]
                    },
                    onmove: (event) => {
                        console.log('dragmove');
                        event.target.setAttribute('data-move', 'true');
                        let posTop = event.pageY - this.originY;
                        let posLeft = event.pageX - this.originX;
                        event.target.style.top = posTop + 'px';
                        event.target.style.left = posLeft + 'px';
                        element.setAttribute('data-x', Math.round(posLeft / this.cellSize).toString());
                        element.setAttribute('data-y', Math.round(posTop / this.cellSize).toString());
                    }
                })
                .on('doubletap', function (event) {
                    element.classList.toggle('rotate');
                    //element.setAttribute('data-x', (parseInt(element.getAttribute('data-x')) - 2).toString());
                });
        }
    }

}
