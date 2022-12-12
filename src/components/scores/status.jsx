import {useEffect, useState, useContext} from "react";
import Context from '../../context';
import useColorChange from 'use-color-change';

const Status = () => {
    const { hero, enemy } = useContext(Context);
    const [heroLife, setHeroLife] = useState(0);
    const [enemyLife, setEnemyLife] = useState(0);
    const heroLifeStyle = useColorChange(heroLife, {
        higher: '#26e026',
        lower: '#ee1f1f',
        duration: 2000
    });
    const enemyLifeStyle = useColorChange(enemyLife, {
        higher: '#26e026',
        lower: '#ee1f1f',
        duration: 2000
    });
    useEffect(()=> {
        hero && hero.life !== heroLife && setHeroLife(Math.ceil(hero.life));
        enemy && enemy.life !== enemyLife && setEnemyLife(Math.ceil(enemy.life));
    },[enemy && enemy.life,hero && hero.life]);
    return <div>
        {hero && hero.getName && enemy && enemy.getName && <>
            <br />
            En ce moment: 
            <br />
            <span className="win">{hero.name}</span> 💙<b style={heroLifeStyle}>{heroLife}</b> VS <b style={enemyLifeStyle}>{enemyLife}</b>💙 <span className="win">{enemy.name}</span>
        </>}</div>
}

export default Status;