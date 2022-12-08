class Weapon {
    constructor(name,damage=10) {
        this.name = name;
        this.damage = damage;
        this.defaultDurability = 30;
        this.durability = 30;
    }
    use() {
        if (this.durability === 0) {
            return false;
        }
        this.durability -= 1;
        return true;
    }
}

export default Weapon;