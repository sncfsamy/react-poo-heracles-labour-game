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
                <div>{fighter.name}</div>
                <div>
                    <span style={win}>&nbsp;{fighter.winCount}</span>
                </div>
                <div>
                    <span style={death}>&nbsp;{fighter.deathCount}</span>
                </div>
            </>
}
export default Score;