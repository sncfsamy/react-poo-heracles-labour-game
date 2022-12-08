import React, {useState, useRef, useEffect} from 'react';
import './App.css';
import Combat from './components/combat/combat';
import Header from './components/header/header';
import Panel from './components/panel/panel';
import Scores from './components/scores/scores';
import initialFighters from './fighters';
import Context from './context';
import Footer from './components/footer/footer';

let round = 1;
let toLog = <></>;
let restartTimeout;
function App() {
  const [log, setLog] = useState(<></>);
  const [toSimulate, setToSimulate] = useState(0);
  const [fighters, setFighters] = useState(initialFighters);
  const [hero, setHero] = useState(initialFighters[0]);
  const [enemy, setEnemy] = useState(initialFighters[1]);
  const [inSimulation, setInSimulation] = useState(false);
  const autoEnemy = useRef(false);
  const [autoGame, setAutoGame] = useState(false);
  const [inFight, setInFight] = useState(false);
  function pickNewEnemy() {
    const enemies = fighters.filter(fighter => fighter.id !== hero.id && fighter.id !== enemy.id);
    setEnemy(enemies[Math.ceil(Math.random() * enemies.length)-1]);
  }
  function fight() {
    let attackHero, attackEnemy;
    hero.isAliveFct(() => attackHero = hero.fight(enemy));
    enemy.isAliveFct(() => attackEnemy = enemy.fight(hero));
    const fightEnded = !(enemy.isAlive() && hero.isAlive());
    if (fightEnded) {
      hero.attacks += hero.attacksLastFight;
      hero.attacksSum += hero.attacksSumLastFight;
      enemy.attacks += enemy.attacksLastFight;
      enemy.attacksSum += enemy.attacksSumLastFight;
    }
    toLog = <>{toLog}<div>🕛 Round n°{round}</div>{attackHero ? attackHero : ""}{attackEnemy ? attackEnemy:""}</>;
    if (!fightEnded){
        round++;
        setTimeout(fight, inSimulation ? 0 : 500);
    } else {
      const heroAverageGlobalDamage = (hero.attacksSumLastFight/hero.attacksLastFight).toFixed(2);
      const enemyAverageGlobalDamage = (enemy.attacksSumLastFight/enemy.attacksLastFight).toFixed(2);
      const heroAverageDamage = (hero.attacksSum/hero.attacks).toFixed(2);
      const enemyAverageDamage = (enemy.attacksSum/enemy.attacks).toFixed(2);
  
      hero.attacksSumLastFight = 0;
      hero.attacksLastFight = 0;
      enemy.attacksSumLastFight = 0;
      enemy.attacksLastFight = 0;

      toLog = <>{toLog}<div>🕛 Le combat s'est terminé au round n°{round}</div>
          <div>Dégats moyens de {hero.name} : <b>{heroAverageGlobalDamage}pts/attaque</b> sur ce combat. <b>{heroAverageDamage}pts/attaque</b> cumulés sur tous ses combats.</div>
          <div>Dégats moyens de {enemy.name} : <b>{enemyAverageGlobalDamage}pts/attaque</b> sur ce combat. <b>{enemyAverageDamage}pts/attaque</b> cumulé sur tous ses combats.</div>
          </>;
    
      if (inSimulation) {
        if (toSimulate > 0) {
          setToSimulate(toSimulate -1);
          setInFight(false);
        }
        else {
          setInFight(false);
          setInSimulation(false);
        }
      } else {
        setInFight(false);
        if (autoGame) {
          if (autoEnemy.current) pickNewEnemy();
          restartTimeout = setTimeout(()=> {restartTimeout=undefined; startFight();}, 10000);
        }
      }
    };
    setLog(toLog);
  }

  function startFight() {
    setInFight(true);
    round = 1;
    let heal = 0;
    toLog = <></>;
    if (!hero.isAlive()) {
        hero.weapon = null;
        hero.shield = null;
    }
    if (hero.life < 100) {
        heal = (enemy.defaultLife - hero.life > 100 || hero.life === 0) ? 100-hero.life : 50;
        heal = (hero.life+heal > 100)? 100-hero.life : heal;
        toLog = <>{toLog}<div>{hero.heal(heal)}</div></>;
    }
    if (hero.canHaveWeapon && !hero.shield && !hero.weapon && (Math.random() > 0.8 || enemy.needWeapon)) {
        hero.giveWeapon();
        hero.giveShield();
        toLog = <>{toLog}<div>{hero.name} a trouvé une <b className="weapon">{hero.weapon.name}</b> et un <b className="shield">{hero.shield.name}</b> !</div></>;
    }
    if (enemy.life < 100) enemy.life = enemy.defaultLife;
    toLog = <>{toLog}<div>{hero.getLife()}</div><div>{enemy.getLife()}</div><div className={"win"}>Le combat commencera dans 10sec...</div></>
    setLog(toLog);
    restartTimeout = setTimeout(() => {restartTimeout=undefined; fight();}, inSimulation ? 0 : 10000);
  }
  useEffect(() => {
    if(!inFight && inSimulation && toSimulate > 0) {
      if (autoEnemy.current) pickNewEnemy();
      startFight();
    } else if (inSimulation && toSimulate === 0) {
      setInSimulation(false);
    } else if (!inSimulation && restartTimeout && !autoGame) {
      clearTimeout(restartTimeout);
      restartTimeout = undefined;
      setInFight(false);
      setLog(<div className="death">Combat annulé !</div>);
    } else if (!inFight && !restartTimeout && autoGame) {
      setLog(<div className="win">Un combat commencera dans 10sec...</div>);
      restartTimeout = setTimeout(() => {restartTimeout=undefined; fight();}, 10000);
      setInFight(true);
    }
  }, [autoGame,toSimulate,inSimulation]);

  return (
    <div>
      <Context.Provider value={{ log, hero, enemy, fighters, toSimulate, autoEnemy }}>
        <Header />
        <div className="content">
          <Panel 
            autoGame={autoGame} 
            setAutoGame={setAutoGame}
            inSimulation={inSimulation}
            setInSimulation={setInSimulation}
            inFight={inFight}
            fight={fight}
            setHero={setHero}
            setEnemy={setEnemy}
            startFight={startFight}
            setFighters={setFighters}
            pickNewEnemy={pickNewEnemy}
            setToSimulate={setToSimulate}
          />
          <Combat autoGame={autoGame} />
          <Scores inSimulation={inSimulation} />
        </div>
        <Footer />
      </Context.Provider>
    </div>
  );
}

export default App;
