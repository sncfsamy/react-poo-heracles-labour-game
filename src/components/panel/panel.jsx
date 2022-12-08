import React, {useContext, useState} from "react";
import './panel.css';
import Context from '../../context';
import EditFighter from "./editfighter";

const Panel = ({ autoGame, startFight, inFight, inSimulation, setAutoGame, pickNewEnemy,
    setHero, setEnemy, setFighters, setToSimulate, setInSimulation }) => {
    const findById = (fighter,id) => fighter.id===parseInt(id);
    const { hero, enemy, fighters, toSimulate, autoEnemy } = useContext(Context);
    const [selectedFighter, setSelectedFighter] = useState(-1);
    const [localAutoEnemy, setLocalAutoEnemy] = useState(autoEnemy.current);
    const handleHeroSelect = (e) => setHero(fighters.find((fighter => { return findById(fighter, e.target.value)})));
    const handleEnemySelect = (e) => setEnemy(fighters.find((fighter => { return findById(fighter, e.target.value)})));
    const handleSimulate = (e) => {
        if (!inSimulation) {
            if (toSimulate > 0) {
                setInSimulation(true);
            }
        } else {
            setInSimulation(false);
        }
    };
    const handleFight = () => {
        if(autoEnemy.current) pickNewEnemy();
        startFight();
    }
    const handleAutoEnemy = (e) => {
        setLocalAutoEnemy(!autoEnemy.current);
        autoEnemy.current = !autoEnemy.current;
    }
    return <aside>
        <div>
            <h2>Gestion des combats</h2>
        </div>
        <section className="fighters">
            <div>
                <div><h3>Héro</h3></div>
                <select id="hero" size="4" value={(hero && hero.id) || fighters[0].id} onChange={handleHeroSelect} disabled={inSimulation || inFight}>
                    { fighters.map(fighter => 
                        <option 
                            key={fighter.id}
                            value={fighter.id} 
                            disabled={enemy && enemy.id===fighter.id}
                            >
                                {fighter.getReverseName && fighter.getReverseName()}
                        </option>
                    )}
                </select>
            </div>
            <div>
                <div><h3>Ennemi</h3><label htmlFor="auto-enemy">Aléatoire<input type="checkbox" id="auto-enemy" value={localAutoEnemy} onChange={handleAutoEnemy} /></label></div>
                <select id="ennemy" size="4" value={(enemy && enemy.id) || fighters[1].id} onChange={handleEnemySelect} disabled={inSimulation || localAutoEnemy || inFight}>
                    { fighters.map(fighter => 
                        <option 
                            key={fighter.id}
                            value={fighter.id} 
                            disabled={hero && hero.id===fighter.id}
                            >
                                {fighter.getReverseName()}
                        </option>
                    )}
                </select>
            </div>
        </section>
        <section>
            <div className="buttons"><label htmlFor="autoGame"><input type="checkbox" id="autoGame" value={autoGame} disabled={inSimulation} onChange={(e)=> setAutoGame(!autoGame) } />Enchainer les combats automatiquement</label><button disabled={inSimulation || inFight} onClick={handleFight}>Combattre!</button></div>
        </section>
        <section>
            <h3>Edition des combattants</h3>
            <div className="select-fighters">
                <select onChange={(e) => setSelectedFighter(e.target.value)} value={selectedFighter} disabled={inSimulation}>
                    <option value="-1">Ajouter un combattant</option>
                    { fighters.map(fighter => 
                        <option key={fighter.id} value={fighter.id}>
                            {fighter.name}
                        </option>
                    )}
                </select>
            </div>
            <EditFighter selectedFighter={selectedFighter} setFighters={setFighters} fighters={fighters} inFight={inFight} inSimulation={inSimulation} />
        </section>
        <section>
            <h3>Simulation de combats de masse</h3>
            <div><label htmlFor="simulation">Combats</label><input type="number" value={toSimulate} onChange={(e) => (e.target.value !== "" && /^\d*$/.test(e.target.value)) && setToSimulate(parseInt(e.target.value))} disabled={inSimulation} /></div>
            <div className="buttons"><button onClick={handleSimulate} disabled={(inFight && !inSimulation) || toSimulate === 0}>{inSimulation ? "Interrompre" : "Démarrer la simulation"}</button></div>
        </section>
    </aside>
}
export default Panel;