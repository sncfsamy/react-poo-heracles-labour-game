import React, {useState, useRef, useEffect} from 'react';
import './App.css';
import Combat from './components/combat/combat';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import Panel from './components/panel/panel';
import Scores from './components/scores/scores';
import socketIO from "socket.io-client";
import Context from './context';
import Fighter from './custom_class/Fighter';
import socketURL from './socket_url';

const socket = socketIO.connect(socketURL, {secure: true});

let round = 1;
let toLog = <></>;
let restartTimeout;
function App() {
  const [log, setLog] = useState(<></>);
  const [toSimulate, setToSimulate] = useState(0);
  const [fighters, setFighters] = useState([]);
  const [hero, setHero] = useState(fighters[0] && fighters[0]);
  const [enemy, setEnemy] = useState(fighters[1] && fighters[1]);
  const [doStartFight, setDoStartFight] = useState(false);
  const [inSimulation, setInSimulation] = useState(false);
  const [refreshFighters, setRefreshFighters] = useState(true);
  const autoEnemy = useRef(false);
  const [autoGame, setAutoGame] = useState(false);
  const [inFight, setInFight] = useState(false);
  const [playersOnline, setPlayersOnline] = useState(0);
  function pickNewEnemy() {
    const enemies = fighters.filter(fighter => fighter.id !== hero.id && fighter.id !== enemy.id);
    setEnemy(enemies[Math.ceil(Math.random() * enemies.length)-1]);
  }
  function fight() {
    let attackHero, attackEnemy;
    attackHero = hero.isAlive() && hero.fight(enemy);
    attackEnemy = enemy.isAlive() && enemy.fight(hero);
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
        setTimeout(fight, inSimulation ? 1 : 500);
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
        // if (autoGame) {
        //   if (autoEnemy.current) pickNewEnemy();
        //   restartTimeout = setTimeout(()=> {restartTimeout=undefined; startFight();}, 10000);
        // }
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
    if (hero.life < hero.defaultLife) {
      heal = (enemy.defaultLife - hero.life > hero.defaultLife || hero.life === 0 || enemy.needWeapon) ? hero.defaultLife-hero.life : 50;
      heal = (hero.life+heal > hero.defaultLife)? hero.defaultLife-hero.life : heal;
      toLog = <>{toLog}<div>{hero.heal(heal)}</div></>;
    }
    if (enemy.life < enemy.defaultLife) {
      heal = (hero.defaultLife - enemy.life > enemy.defaultLife || enemy.life === 0 || hero.needWeapon) ? enemy.defaultLife-enemy.life : 50;
      heal = (enemy.life+heal > enemy.defaultLife)? enemy.defaultLife-enemy.life : heal;
      toLog = <>{toLog}<div>{enemy.heal(heal)}</div></>;
    }
    if (hero.canHaveWeapon && !hero.shield && !hero.weapon && (((Math.random() > 0.5 || Math.random() < 0.2) && enemy.needWeapon) || Math.random() > 0.8)) {
      hero.giveWeapon();
      hero.giveShield();
      toLog = <>{toLog}<div>{hero.name} a trouvé une <b className="weapon">{hero.weapon.name}</b> et un <b className="shield">{hero.shield.name}</b> !</div></>;
    }
    if (enemy.canHaveWeapon && !enemy.shield && !enemy.weapon && (((Math.random() > 0.5 || Math.random() < 0.2) && hero.needWeapon) || Math.random() > 0.8)) {
      enemy.giveWeapon();
      enemy.giveShield();
      toLog = <>{toLog}<div>{enemy.name} a trouvé une <b className="weapon">{enemy.weapon.name}</b> et un <b className="shield">{enemy.shield.name}</b> !</div></>;
    }
    toLog = <>{toLog}<div>{hero.getLife()}</div><div>{enemy.getLife()}</div>{!inSimulation && <div className={"win"}>Le combat commencera dans 5sec...</div>}</>
    setLog(toLog);
    restartTimeout = setTimeout(() => {restartTimeout=undefined; fight();}, inSimulation ? 1 : 5000);
  }
  useEffect(() => {
    if ((!inFight && inSimulation && toSimulate > 0) || (!inFight && !restartTimeout && autoGame)) {
      if (autoEnemy.current) pickNewEnemy();
      setDoStartFight(true);
    } else if (inSimulation && toSimulate === 0) {
      setInSimulation(false);
    } else if (!inSimulation && restartTimeout && !autoGame) {
      clearTimeout(restartTimeout);
      restartTimeout = undefined;
      setInFight(false);
      setLog(<div className="death">Combat annulé !</div>);
    } 
  }, [autoGame,toSimulate,inSimulation,inFight]);
  useEffect(() => {
    if (doStartFight) {
      restartTimeout = setTimeout(() => {restartTimeout=undefined; startFight();}, 1);
      setDoStartFight(false);
    }
  }, [doStartFight]);
  useEffect(() => {
    if (refreshFighters) {
      fetch(socketURL)
      .then(response => {
        return response.json();
      })
      .then(data => {
        const newFighters = [];
        data.forEach(({id,emoji,name,strength,dexterity,defaultLife,canHaveWeapon,needWeapon}) => newFighters.push(new Fighter(id,emoji,name,strength,dexterity,canHaveWeapon,needWeapon,defaultLife)));
        setFighters(newFighters);
        if ((hero && hero.id) || (enemy && enemy.id)) {
          let heroSet = false;
          let enemySet = false;
          newFighters.forEach(fighter => { 
            if (hero && fighter.id === hero.id) {
              heroSet = true;
              setHero(fighter);
            } else if (enemy && fighter.id === enemy.id) { 
              enemySet = true;
              setEnemy(fighter);
            }
            setHero((!hero && newFighters[0]) ? newFighters[0] : hero);
            setEnemy((!enemy && newFighters[1]) ? newFighters[1] : enemy);
          });
        } else {
          setHero(!hero && newFighters[0] && newFighters[0]);
          setEnemy(!enemy && newFighters[1] && newFighters[1]);
        }
      });
      setRefreshFighters(false);
    }
  }, [refreshFighters]);
  useEffect(() => {
    socket.off("add");
    socket.off("update");
    socket.off("delete");
    socket.off("players");
    socket.off("reset");
    socket.on("add", ({id,emoji,name,strength,dexterity,defaultLife,canHaveWeapon,needWeapon}) => {
      const newFighters = [...fighters];
      newFighters.push(new Fighter(id,emoji,name,strength,dexterity,canHaveWeapon,needWeapon,defaultLife));
      setFighters(newFighters);
    });
    socket.on("update", ({id,emoji,name,strength,dexterity,defaultLife,canHaveWeapon,needWeapon}) => {
      const newFighters = [...fighters];
      newFighters.forEach(f => {
        if (f.id == id) {
          f.emoji = emoji;
          f.name = name;
          f.strength = strength;
          f.dexterity = dexterity;
          f.defaultLife = defaultLife;
          f.canHaveWeapon = canHaveWeapon;
          f.needWeapon = needWeapon;
          if (hero.id === id) {
            hero.emoji = emoji;
            hero.name = name;
            hero.strength = strength;
            hero.dexterity = dexterity;
            hero.defaultLife = defaultLife;
            hero.canHaveWeapon = canHaveWeapon;
            hero.needWeapon = needWeapon;
          } else if (enemy.id === id) {
            enemy.emoji = emoji;
            enemy.name = name;
            enemy.strength = strength;
            enemy.dexterity = dexterity;
            enemy.defaultLife = defaultLife;
            enemy.canHaveWeapon = canHaveWeapon;
            enemy.needWeapon = needWeapon;
          }
          return;
        }
      });
      setFighters(newFighters);
    });
    socket.on("delete", (id) => {
      const newFighters = [...fighters];
      for (let i=0; i<newFighters.length; i++)
      {
        if (newFighters[i].id === parseInt(id)) {
          if (hero && hero.id === id || enemy && enemy.id === id) {
            inFight && setInFight(false);
            inSimulation && setInSimulation(false);
            hero && hero.id===id && setHero((newFighters[0] && (!enemy || newFighters[0].id !== enemy.id)) ? newFighters[0] : newFighters[1] && newFighters[1]);
            enemy && enemy.id===id && setEnemy((newFighters[1] && (!hero || newFighters[1].id !== hero.id)) ? newFighters[1] : null);
          } 
          newFighters.splice(i,1);
          break;
        }
      }
      setFighters(newFighters);
    });
    socket.on("players", (total) => {
      setPlayersOnline(total);
    });
    socket.on("reset", (data) => {
      if (inSimulation || inFight) {
        setInFight(false);
        setInSimulation(false);
      }
      const newFighters = [];
      data.forEach(({id,emoji,name,strength,dexterity,defaultLife,canHaveWeapon,needWeapon}) => {
        newFighters.push(new Fighter(id,emoji,name,strength,dexterity,canHaveWeapon,needWeapon,defaultLife));
      });
      setFighters(newFighters);
      
      !hero && setHero(newFighters[0] && newFighters[0]);
      !enemy && setEnemy(newFighters[1] && newFighters[1]);
    });
  }, [fighters, inFight, inSimulation]);
  return (
      <Context.Provider value={{ log, hero, enemy, fighters, toSimulate, autoEnemy }}>
        <Header />
        <div className="content">
          <Panel 
            autoGame={autoGame} 
            setAutoGame={setAutoGame}
            inSimulation={inSimulation}
            setInSimulation={setInSimulation}
            inFight={inFight}
            setInFight={setInFight}
            fight={fight}
            setToSimulate={setToSimulate}
            socketURL={socketURL}
            setDoStartFight={setDoStartFight}
            setHero={setHero}
            setEnemy={setEnemy}
          />
          <Combat />
          <Scores inSimulation={inSimulation} playersOnline={playersOnline} />
        </div>
        <Footer />
      </Context.Provider>
  );
}

export default App;
