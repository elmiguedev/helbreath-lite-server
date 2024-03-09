"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePlayerAction = void 0;
var CreatePlayerAction = /** @class */ (function () {
    function CreatePlayerAction(playerService) {
        this.playerService = playerService;
    }
    CreatePlayerAction.prototype.execute = function (params) {
        // TODO:  esto no va aca sino que se trae de la base de 
        //        datos del juego. Para mockupear el player le
        //        ponemos stats de uno de
        var player = {
            id: params.id,
            name: params.name,
            worldMapId: params.worldMapId,
            attributes: {
                vitality: 20,
                charisma: 10,
                dexterity: 30,
                strength: 20,
                intelligence: 10,
                magic: 10,
                luck: 10
            },
            bounds: {
                width: 16,
                height: 16,
            },
            stats: {
                experience: 13365,
                health: 122,
                level: 20,
                mana: 67,
                maxHealth: 122,
                maxMana: 67,
                maxStamina: 122,
                stamina: 122,
                freeLevelPoints: 0
            },
            position: {
                x: 620,
                y: 580
            },
            skills: {
                axe: 100,
                hammer: 100,
                longSword: 100,
                shortSword: 100,
                staff: 100
            }
        };
        this.playerService.addPlayer(player);
    };
    return CreatePlayerAction;
}());
exports.CreatePlayerAction = CreatePlayerAction;
