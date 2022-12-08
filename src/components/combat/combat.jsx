import React, {useContext, createRef, useEffect} from "react";
import './combat.css';
import Context from '../../context';

const Combat = ({autoGame, inFight}) => {
    const { log, hero, enemy } = useContext(Context);
    const ref = createRef();
    useEffect(() => {
        ref.current?.scrollIntoView();
    }, [log,ref]);
    return <main id="game">{log}<div ref={ref} />{(!inFight && autoGame && (!hero.isAlive() || !enemy.isAlive())) && <div className="win">Un combat recommencera dans 10sec...</div>}</main>
}
export default Combat;