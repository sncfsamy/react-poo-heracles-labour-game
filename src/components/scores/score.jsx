import {useState, useEffect} from "react";
import useColorChange from 'use-color-change';
const Score = ({fighter, inSimulation}) => {
    const [winCount, setWinCount] = useState(fighter.winCount);
    const [deathCount, setDeathCount] = useState(fighter.deathCount);
    const win = useColorChange(winCount, {
        higher: '#26e026',
        lower: 'crimson',
        duration: inSimulation ? 0:10000
    });
    const death = useColorChange(deathCount, {
        higher: '#ee1f1f',
        lower: 'crimson',
        duration: inSimulation ? 0:10000
    });
    useEffect(() => {
        setWinCount(fighter.winCount);
        setDeathCount(fighter.deathCount);
    }, [fighter.winCount,fighter.deathCount]);
    return  <>
                <div><span className="hero">{fighter.name.substring(0,2)}</span><span className="hero-name">{fighter.name.substring(3)}</span></div>
                <div>&nbsp;
                    <span className="score" style={win}>&nbsp;{fighter.winCount}</span>
                </div>
                <div>&nbsp;
                    <span className="score" style={death}>&nbsp;{fighter.deathCount}</span>
                </div>
            </>
}
export default Score;