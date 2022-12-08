class Shield {
    constructor(name,protection) {
        this.name = name;
        this.protection = protection;
        this.defaultDurability = 50;
        this.durability = 50;
    }
    use() {
        if (this.durability === 0) {
            return false;
        }
        this.durability -= 1;
        return true;
    }
}

export default Shield;