import React, {useContext} from "react";
import './scores.css';
import Context from '../../context';
import Score from './score';

const Scores = ({inSimulation}) => {
    const { fighters } = useContext(Context);
    return  <div>
                <h2>Scores:</h2>
                <div className="scoreslist">
                    <div><span><u>Combattants</u></span></div><div><span className="hero">🏆</span></div><div><span className="hero">💀</span></div>
                    <div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div>
                    { fighters.map(fighter => <Score key={fighter.id} fighter={fighter} inSimulation={inSimulation} />) }
                </div>
            </div>;
}
export default Scores;