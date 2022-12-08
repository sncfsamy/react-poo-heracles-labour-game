import Weapon from './Weapon';
import Shield from './Shield';

/* Fighter class definition */
const MAX_LIFE = 100;
let ids = Math.ceil(Math.random()*1000000);
const weapons = [
    new Weapon("Super épée brillante",19),
    new Weapon("Épée de bonne facture", 13),
    new Weapon("Épée pointue un peu émoussée", 10)
];

const shields = [
    new Shield("Bouclier en vibranioum", 17),
    new Shield("Grand bouclier en fer forgé", 13),
    new Shield("Vieux bouclier pourri", 10)
];

class Fighter {
    constructor (name, strength, dexterity, canHaveWeapon = false, needWeapon = false, life = MAX_LIFE) {
        this.name = name;
        this.strength = strength;
        this.dexterity = dexterity;
        this.life = life;
        this.defaultLife = life;
        this.badChance = 0;
        this.winCount = 0;
        this.deathCount = 0;
        this.weapon = null;
        this.shield = null;
        this.id = ids;
        this.attacks = 0;
        this.attacksSum = 0;
        this.attacksLastFight = 0;
        this.attacksSumLastFight = 0;
        this.canHaveWeapon = canHaveWeapon;
        this.needWeapon = needWeapon;
        ids++;
    }

    setLooseWeaponOrShield(f) {
        this.addToPage = f;
    }

    looseWeapon(fighter) {
        let msg;
        switch(Math.ceil(Math.random() * 10)) {
            case 1:
                msg = <div><b className="loosing">{this.name} a perdu son </b><b className="weapon">{this.weapon.name}</b><b className="loosing"> !</b></div>;
                break;
            case 2:
                msg =  <div><b className="loosing">{this.name} a perdu son </b><b className="weapon">{this.weapon.name}</b><b className="loosing"> à cause de {fighter.name} !</b></div>;
                break;
            case 3:
                msg =  <div><b className="loosing">{fighter.name} a cassé </b><b className="weapon">l'{this.weapon.name}</b><b className="loosing"> de {this.name}</b></div>;
                break;
            case 4:
                msg =  <div><b className="loosing">{fighter.name} a avalé </b><b className="weapon">l'{this.weapon.name}</b><b className="loosing"> de {this.name}</b></div>;
                break;
            case 5:
                msg =  <div><b className="loosing">{fighter.name} a gardé </b><b className="weapon">l'{this.weapon.name}</b><b className="loosing"> de {this.name} enfoncée dans son flanc !</b></div>;
                break;
            case 6:
                msg =  <div><b className="loosing">{this.name} a laissé tomber son </b><b className="weapon">{this.weapon.name}</b><b className="loosing"> !</b></div>;
                break;
            default:
                msg =  <div><b className="loosing">{this.name} a laissé échaper son </b><b className="weapon">{this.weapon.name}</b><b className="loosing"> !</b></div>;
        }
        this.weapon = null;
        return msg;
    }

    looseShield() {
        const msg = <div><b className="loosing">{this.name} a perdu son </b><b className="shield">{this.shield.name}</b><b className="loosing"> !</b></div>;
        this.shield = null;
        return msg;
    }

    win() {
        this.winCount += 1;
    }

    death() {
        this.deathCount += 1;
    }

    getLife() {
        return this.name + " 💙: " + Math.ceil(this.life);
    }

    getName() {
        return (this.shield?"🛡️":"") + (this.weapon? "🗡️" : "") + " " + this.name;
    }

    getReverseName() {
        return this.name + " " + (this.weapon? "🗡️" : "") + (this.shield?"🛡️":"");
    }

    giveWeapon() {
        this.weapon = weapons[Math.ceil(Math.random() * weapons.length)-1];
        this.weapon.durability = this.defaultDurability;
    }

    giveShield() {
        this.shield = shields[Math.ceil(Math.random() * shields.length)-1];
        this.shield.durability = this.defaultDurability;
    }

    getDamage(fighter) {
        const weaponDamage = this.weapon && this.weapon.durability ? this.weapon.damage : 0;
        let attack = Math.random() * (this.strength + weaponDamage);
        let msg, looseShield, looseWeapon;
        const defAttack = attack;
        attack = (attack - fighter.getDefense())>0 ? attack-fighter.getDefense(): Math.random()>0.5? 1 : 0;
        if (attack <= 1)
            if ((Math.random() + Math.random() + Math.random() +Math.random() + this.dexterity/25 + this.badChance) > 3.2 || (this.canHaveWeapon && Math.random()>0.9) || (this.needWeapon && Math.random()>0.7 && Math.random()>0.7 && Math.random()>0.7)) {
             attack = ((Math.random()+this.badChance) * this.strength)-fighter.getDefense()/4;
             attack = attack<10 && this.canHaveWeapon? attack+10 : attack>17 && this.needWeapon? attack/2 : attack;
             msg = <div><span className="chance">{this.name} réussi à attaquer par chance ! (<b> {attack.toFixed(2)}pts de dégats</b> dont <b>{this.badChance.toFixed(2)}pts de dégats de chance</b> !)</span></div>;
             this.badChance = 0;
            } else this.badChance += 0.025;
        
        if (attack && this.weapon && !this.weapon.use()) looseWeapon = this.looseWeapon(fighter);

        if (defAttack && fighter.shield && !fighter.shield.use()) looseShield = fighter.looseShield();
        
        return [attack, msg, looseWeapon, looseShield];
    }

    getDefense() {
        return this.dexterity + (this.shield? this.shield.protection : 0);
    }

    fight(fighter) {
        if (this.life === 0) return null;
        let [attack, chance, looseWeapon, looseShield] = this.getDamage(fighter);
        this.attacksLastFight++;
        this.attacksSumLastFight += attack;
        fighter.life -= (fighter.life-attack >=0)? Math.abs(attack) : fighter.life;
        if (fighter.life === 0) {
            this.win();
            fighter.death();
        } else if (this.life === 0) {
            fighter.win();
            this.death();
        }
        
        return <>{chance}{looseWeapon?looseWeapon:<></>}{looseShield?looseShield:<></>}{fighter.life > 0 ? 
            <div>{this.getName()} ⚔️ {fighter.name}: {fighter.getLife()}</div> : 
            <div><br /><br />🏆 {this.name} a gagné ! ({this.getLife()})<br />💀 {fighter.name} est mort</div>}
        </>;
    }

    getScore() {
        return <><div>{this.name}</div><div><span id={"win" + this.id}>&nbsp;{this.winCount}</span></div><div><span id={"death" + this.id}>&nbsp;{this.deathCount}</span></div></>;
    }

    isAliveFct(f) {
        if (this.life) return f();
    }

    isAlive() {
        return (this.life);
    }
    heal(healthpoints) {
        this.life += healthpoints;
        return <div>{this.name} a été soigné de {Math.floor(healthpoints)} 💙</div>;
    }
}

export default Fighter;