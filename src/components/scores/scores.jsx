import React, {useContext} from "react";
import './scores.css';
import Context from '../../context';
import Score from './score';

const Scores = ({inSimulation}) => {
    const { fighters } = useContext(Context);
    return  <div>
                <h3>Scores:</h3>
                <div className="scoreslist">
                    <div><span><u>Combattants</u></span></div><div><br />🏆</div><div><br />💀</div>
                    <div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div>
                    { fighters.map(fighter => <Score key={fighter.id} fighter={fighter} inSimulation={inSimulation} />) }
                </div>
            </div>;
}
export default Scores;