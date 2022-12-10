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
        e.preventDefault();
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
        <h2>Gestion des combats</h2>
        <section>
            <div className="fighters">
                <div>
                    <h3>Héro</h3>
                    <select id="hero" size="5" value={(hero && hero.id) || fighters[0].id} onChange={handleHeroSelect} disabled={inSimulation || inFight}>
                        { fighters.map(fighter => 
                            <option 
                                key={fighter.id}
                                value={fighter.id}
                                disabled={enemy && enemy.id===fighter.id}
                                >
                                    {fighter.getReverseName()}
                            </option>
                        )}
                    </select>
                </div>
                <div>
                    <div><h3>Ennemi</h3><label htmlFor="auto-enemy">Aléatoire<input type="checkbox" id="auto-enemy" value={localAutoEnemy} onChange={handleAutoEnemy} /></label></div>
                    <select id="enemy" size="5" value={(enemy && enemy.id) || fighters[1].id} onChange={handleEnemySelect} disabled={inSimulation || localAutoEnemy || inFight}>
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
            </div>
        </section>
        <section>
            <div className="buttons buttons-game"><label htmlFor="autoGame"><input type="checkbox" id="autoGame" value={autoGame} disabled={inSimulation} onChange={(e)=> setAutoGame(!autoGame) } />Enchainer les combats automatiquement</label><button disabled={inSimulation || inFight} onClick={handleFight}>Combattre!</button></div>
        </section>
        <section>
            <h3>Simulation de combats de masse</h3>
            <form onSubmit={handleSimulate}>
                <div><label htmlFor="simulation">Combats</label><input type="number" size="6" value={toSimulate} onChange={(e) => (e.target.value !== "" && /^\d*$/.test(e.target.value)) && setToSimulate(parseInt(e.target.value))} disabled={inSimulation || inFight} /></div>
                <div className="buttons"><button onClick={handleSimulate} disabled={inFight && !inSimulation}>{inSimulation ? "Interrompre" : "Démarrer la simulation"}</button></div>
            </form>
        </section>
        <section>
            <h3>Edition des combattants</h3>
            <div className="select-fighters">
                <select onChange={(e) => setSelectedFighter(e.target.value)} value={selectedFighter}>
                    <option value="-1">🥷 Ajouter un combattant</option>
                    { fighters.map(fighter => 
                        <option key={fighter.id} value={fighter.id}>
                            {fighter.emoji} {fighter.name}
                        </option>
                    )}
                </select>
            </div>
            <EditFighter selectedFighter={selectedFighter} setFighters={setFighters} fighters={fighters} inFight={inFight} inSimulation={inSimulation} />
        </section>
    </aside>
}
export default Panel;