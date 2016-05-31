var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var game_play_1 = require('../game-play/game-play');
var interact = require('interact.js');
var GameSetup = (function () {
    function GameSetup(nav) {
        this.nav = nav;
        this.cells = [];
        this.shipCount = 0;
        for (var i = 0; i < 100; i++) {
            this.cells.push(i);
        }
    }
    GameSetup.prototype.startGame = function () {
        var shipElements = document.getElementsByClassName('ship');
        var ships = [];
        for (var i = 0; i < shipElements.length; i++) {
            var shipElement = shipElements.item(i);
            var ship = {
                orientation: shipElement.classList.contains('rotate') ? 'vertical' : 'horizontal',
                type: shipElement.getAttribute('data-type'),
                x: parseInt(shipElement.getAttribute('data-x')),
                Y: parseInt(shipElement.getAttribute('data-y')),
            };
            console.log("X");
            console.log("Y");
            ships.push(ship);
        }
        this.nav.push(game_play_1.GamePlay, {
            ships: ships
        });
    };
    GameSetup.prototype.initShip = function (game, type) {
        var ship = document.createElement('div');
        ship.setAttribute('data-type', type.toString());
        ship.setAttribute('data-x', '0');
        ship.setAttribute('data-y', this.shipCount.toString());
        ship.className = 'ship ship-' + type;
        ship.style.height = this.cellSize + 'px';
        ship.style.width = (this.cellSize * type) + 'px';
        ship.style.left = '0px';
        ship.style.top = (this.cellSize * this.shipCount) + 'px';
        ship.style.transformOrigin = this.cellSize / 2 + 'px' + this.cellSize / 2 + 'px';
        ship.addEventListener('touchstart', function () {
            ship.classList.toggle('rotate');
        });
        ship.addEventListener('touchend', function () {
            if (ship.getAttribute('data-move') == 'false') {
                ship.classList.toggle('rotate');
            }
            ;
        });
        ship.setAttribute('data-x', Math.round(parseFloat(ship.style.left) / this.cellSize).toString());
        ship.setAttribute('data-y', Math.round(parseFloat(ship.style.top) / this.cellSize).toString());
        game.appendChild(ship);
        this.shipCount++;
    };
    GameSetup.prototype.ngAfterContentInit = function () {
        var game = document.getElementById('game');
        var gameSize = game.clientWidth + 'px';
        game.style.width = gameSize;
        game.style.height = gameSize;
        this.cellSize = game.clientWidth / 10;
        this.originX = game.getClientRects()[0].left;
        this.originY = game.getClientRects()[0].top;
        var z = 4;
        for (var i = 2; i <= 5; i++) {
            var j = 0;
            while (j < z) {
                this.initShip(game, i);
                j++;
            }
            z--;
        }
        //http://interactjs.io/
        var element = document.getElementsByClassName('ship'), x = this.originX, y = this.originY;
        interact(element)
            .draggable({
            snap: {
                targets: [
                    interact.createSnapGrid({ x: this.cellSize, y: this.cellSize, })
                ],
                range: Infinity,
                relativePoints: [{ x: this.originX, y: this.originY }]
            },
            inertia: true,
            restrict: {
                restriction: "parent",
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
                endOnly: true
            }
        })
            .on('dragmove', function (event) {
            console.log('dragmove');
            event.target.setAttribute('data-move', 'true');
            event.target.style.top = (event.pageY - this.originY) + 'px';
            event.target.style.left = (event.pageX - this.originX) + 'px';
        });
        /*
         //http://interactjs.io/
         var element = document.getElementsByClassName('ship'), x = this.originX, y = this.originY;
        interact(element)
            .draggable({
              restrict: {
                restriction: "parent",
                endOnly: true,
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
              },
              inertia: true,
              snap: {
                targets: [
                    interact.createSnapGrid({
                      x: this.cellSize,
                      y: this.cellSize,
                      offset : { x:this.originX, y:this.originY }
                    })
                ],
              },
              onmove : (event) => {
                event.target.setAttribute('data-move', 'true');
                event.target.style.top = (event.pageY - this.originY) + 'px';
                event.target.style.left = (event.pageX - this.originX) + 'px';
              }
            });
        */
    };
    GameSetup = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/game-setup/game-setup.html',
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController])
    ], GameSetup);
    return GameSetup;
})();
exports.GameSetup = GameSetup;
