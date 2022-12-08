import React from "react";
import Fighter from "../../custom_class/Fighter";

const EditFighter = ({fighters, selectedFighter, setFighters, inFight, inSimulation}) => {
    const findById = (fighter) => fighter.id===parseInt(selectedFighter);
    const fighterExist = fighters.find(findById)!==undefined;
    const [fighter, setFighter] = React.useState(fighters.find(findById) || new Fighter("",0,0));
    const handleChange = (e) => {
        let value = e.target.id !== "name" && e.target.id !== "needWeapon" && e.target.id !== "canHaveWeapon" ? parseInt(e.target.value) : e.target.id === "needWeapon" || e.target.id === "canHaveWeapon" ? e.target.checked : e.target.value;
        if ((e.target.id === "defaultLife" || e.target.id === "dexterity" || e.target.id === "strength") && (isNaN(e.target.value) || e.target.value === "")) {
            e.target.value = fighter[e.target.id];
            value = e.target.value;
        }
        setFighter({...fighter, [e.target.id] : value});
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const newFighters = [...fighters];
        if (fighterExist) {
            if (e.target.id !== "submit") {
                newFighters.splice(newFighters.indexOf(newFighters.find(findById)),1);
                setFighter(new Fighter("",0,0));
            } else {
                newFighters.forEach(orgFighter => {
                    if (orgFighter.id === fighter.id) {
                        orgFighter.defaultLife = fighter.defaultLife;
                        orgFighter.life = fighter.defaultLife;
                        orgFighter.strength = fighter.strength;
                        orgFighter.dexterity = fighter.dexterity;
                        orgFighter.name = fighter.name;
                        orgFighter.canHaveWeapon = fighter.canHaveWeapon;
                        orgFighter.needWeapon = fighter.needWeapon;
                        return;
                    }
                });
            }
        } else newFighters.push(fighter);
        setFighters(newFighters);
    };
    const isDifferent = () => {
        for (let i=0; i< fighters.length; i++) {
            if (fighters[i].id === parseInt(selectedFighter)) {
                if (fighters[i].name !== fighter.name ||
                    fighters[i].strength !== fighter.strength ||
                    fighters[i].dexterity !== fighter.dexterity ||
                    fighters[i].defaultLife !== fighter.defaultLife ||
                    fighters[i].canHaveWeapon !== fighter.canHaveWeapon ||
                    fighters[i].needWeapon !== fighter.needWeapon) return true;
                break;
            }
        }
        return false;
    }
    React.useEffect(()=> setFighter(fighters.find(findById) || new Fighter("",0,0)),[selectedFighter]);
    return  <div>
                <form onSubmit={handleSubmit}>
                    <div><label htmlFor="name">Nom:</label><input type="text" id="name" value={fighter.name} onChange={handleChange} disabled={inFight || inSimulation} /></div>
                    <div><label htmlFor="strength">Force:</label><input type="number" id="strength" value={fighter.strength} onChange={handleChange} disabled={inFight || inSimulation} /></div>
                    <div><label htmlFor="dexterity">Dexterité:</label><input type="number" id="dexterity" value={fighter.dexterity} onChange={handleChange} disabled={inFight || inSimulation} /></div>
                    <div><label htmlFor="defaultLife">Points de vie:</label><input type="number" id="defaultLife" value={fighter.defaultLife} onChange={handleChange} disabled={inFight || inSimulation} /></div>
                    <div><label htmlFor="canHaveWeapon"><input type="checkbox" id="canHaveWeapon" disabled={inFight || inSimulation} checked={fighter.canHaveWeapon} onChange={handleChange}/>Peut porter arme et bouclier</label></div>
                    <div><label htmlFor="needWeapon"><input type="checkbox" id="needWeapon" disabled={inFight || inSimulation} checked={fighter.needWeapon} onChange={handleChange}/>Nécessite* arme et bouclier pour être battu</label></div>
                    <div><p>* Si il peut s'en équiper, forcera le héro ennemi à obtenir une épée et un bouclier en début de combat.</p></div>
                </form>
                <div className="buttons"><button id="delete" onClick={handleSubmit} disabled={inFight || inSimulation}>{fighterExist ? "Supprimer" : "Ajouter"}</button>{ fighterExist && <button id="submit" onClick={handleSubmit} disabled={inFight || inSimulation || !isDifferent()}>Appliquer les modifications</button>}</div>
            </div>
}
export default EditFighter;