import React, {useState, useEffect} from "react";
import Fighter from "../../custom_class/Fighter";
import EmojiPicker from 'emoji-picker-react';

const EditFighter = ({fighters, selectedFighter, setFighters, inFight, inSimulation}) => {
    const findById = (fighter) => fighter.id===parseInt(selectedFighter);
    const fighterExist = fighters.find(findById)!==undefined;
    const [fighter, setFighter] = useState(fighters.find(findById) || new Fighter("🥷","",0,0));

    const handleChange = (e) => {
        let value = e.target.id !== "name" && e.target.id !== "needWeapon" && e.target.id !== "canHaveWeapon" && e.target.id !== "emoji" ? parseInt(e.target.value) : e.target.id === "needWeapon" || e.target.id === "canHaveWeapon" ? e.target.checked : e.target.value;
        if ((e.target.id === "defaultLife" || e.target.id === "dexterity" || e.target.id === "strength") && (isNaN(e.target.value) || e.target.value === "" || value < 0)) {
            e.target.value = fighter[e.target.id];
            value = e.target.value;
        }
        setFighter({...fighter, [e.target.id] : value});
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        let newFighters = [...fighters];
        if (fighterExist) {
            if (e.target.id !== "submit") {
                newFighters.splice(newFighters.indexOf(newFighters.find(findById)),1);
                setFighter(new Fighter("🥷","",0,0));
            } else {
                newFighters.forEach(orgFighter => {
                    if (orgFighter.id === fighter.id) {
                        orgFighter.emoji = fighter.emoji;
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
        } else {
            const targetFighter = new Fighter(fighter.emoji, fighter.name,fighter.strength,fighter.dexterity,fighter.canHaveWeapon,fighter.needWeapon,fighter.defaultLife);
            newFighters = [...newFighters, targetFighter];
        }
        setFighters(newFighters);
    };
    const isDifferent = () => {
        for (let i=0; i< fighters.length; i++) {
            if (fighters[i].id === parseInt(selectedFighter)) {
                if (fighters[i].emoji !== fighter.emoji ||
                    fighters[i].name !== fighter.name ||
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
    useEffect(()=> setFighter(fighters.find(findById) || new Fighter("🥷","",0,0)),[selectedFighter]);
    return  <div>
                <form className="edit-fighters" onSubmit={handleSubmit}>
                    <div>
                        <div><div>Emoji:</div><div><b style={{fontSize: "xxx-large"}}>{fighter.emoji}</b></div></div>
                        <div><label htmlFor="name">Nom:</label><input type="text" id="name" className="name" value={fighter.name} onChange={handleChange} disabled={inFight || inSimulation} /></div>
                        <div><label htmlFor="strength">Force:</label><input type="number" size="6" id="strength" value={fighter.strength} onChange={handleChange} disabled={inFight || inSimulation} /></div>
                        <div><label htmlFor="dexterity">Dexterité:</label><input type="number" size="6" id="dexterity" value={fighter.dexterity} onChange={handleChange} disabled={inFight || inSimulation} /></div>
                        <div><label htmlFor="defaultLife">Points de vie:</label><input type="number" size="6" id="defaultLife" value={fighter.defaultLife} onChange={handleChange} disabled={inFight || inSimulation} /></div>
                        <div><label htmlFor="canHaveWeapon"><input type="checkbox" id="canHaveWeapon" disabled={inFight || inSimulation} checked={fighter.canHaveWeapon} onChange={handleChange}/>Peut porter arme et bouclier</label></div>
                        <div><label htmlFor="needWeapon"><input type="checkbox" id="needWeapon" disabled={inFight || inSimulation} checked={fighter.needWeapon} onChange={handleChange}/>Nécessite* arme et bouclier pour être battu</label></div>
                        <div><p>* Si il peut s'en équiper, forcera le héro ennemi à obtenir une épée et un bouclier en début de combat.</p></div>
                    </div>
                    <div>
                        <EmojiPicker autoFocusSearch={true} skinTonesDisabled={true} width="170px" height="300px" emojiStyle="native" categories={['smileys_people','animals_nature']} theme="dark" onEmojiClick={(data) => { console.log("émoji cliqué: ", data); handleChange({ target: { id :"emoji", value: data.emoji }}); }}/>
                    </div>
                </form>
                <div className="buttons">
                    <button id="delete" onClick={handleSubmit} disabled={inFight || inSimulation}>
                        {fighterExist ? "Supprimer" : "Ajouter"}
                    </button>
                    { fighterExist && <button id="submit" onClick={handleSubmit} disabled={inFight || inSimulation || !isDifferent()}>
                        Appliquer les modifications
                    </button>}
                </div>
            </div>
}
export default EditFighter;