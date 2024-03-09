"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonsterKilledListener = void 0;
var MonsterKilledListener = /** @class */ (function () {
    function MonsterKilledListener(monsterService) {
        this.monsterService = monsterService;
        this.listeners = [];
        this.monsterService.addMonsterKilledListener(this);
    }
    MonsterKilledListener.prototype.notify = function (monster) {
        this.listeners.forEach(function (listener) {
            listener.notify(monster);
        });
    };
    MonsterKilledListener.prototype.suscribe = function (listener) {
        this.listeners.push(listener);
    };
    return MonsterKilledListener;
}());
exports.MonsterKilledListener = MonsterKilledListener;
