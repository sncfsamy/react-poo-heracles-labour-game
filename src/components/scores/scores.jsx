import React, {useContext} from "react";
import './scores.css';
import Context from '../../context';
import Score from './score';
import useColorChange from 'use-color-change';

const Scores = ({inSimulation, playersOnline}) => {
    const { fighters, hero, enemy } = useContext(Context);
    const onlinePlayers = useColorChange(playersOnline, {
        higher: '#26e026',
        lower: '#ee1f1f',
        duration: 10000
    });
    return  <div className="scores">
                <span><b style={onlinePlayers}>{playersOnline}</b> {playersOnline > 1 ? " joueurs en ligne" : " joueur en ligne"}</span>
                {hero && enemy && <div><br />En ce moment: <br /><span className="win">{hero.name}</span> VS <span className="win">{enemy.name}</span></div>}
                <h2>Scores:</h2>
                <div className="scoreslist">
                    <div><span><u>Combattants</u></span></div><div><span className="hero">🏆</span></div><div><span className="hero">💀</span></div>
                    <div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div>
                    { fighters.map(fighter => <Score key={fighter.id} fighter={fighter} inSimulation={inSimulation} />) }
                </div>
            </div>;
}
export default Scores;