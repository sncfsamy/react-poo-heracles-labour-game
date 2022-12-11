import React, {useContext} from "react";
import './scores.css';
import Context from '../../context';
import Score from './score';

const Scores = ({inSimulation, playersOnline}) => {
    const { fighters } = useContext(Context);
    return  <div className="scores">
                <span>{playersOnline + (playersOnline > 1 ? " joueurs en ligne" : " joueur en ligne")}</span>
                <h2>Scores:</h2>
                <div className="scoreslist">
                    <div><span><u>Combattants</u></span></div><div><span className="hero">🏆</span></div><div><span className="hero">💀</span></div>
                    <div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div>
                    { fighters.map(fighter => <Score key={fighter.id} fighter={fighter} inSimulation={inSimulation} />) }
                </div>
            </div>;
}
export default Scores;