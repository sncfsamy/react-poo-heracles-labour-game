import React, {useContext, createRef, useEffect} from "react";
import './combat.css';
import Context from '../../context';

const Combat = ({autoGame, inFight}) => {
    const { log, hero, enemy } = useContext(Context);
    const ref = createRef();
    useEffect(() => {
        //ref.current?.scrollIntoView();
        ref.current?.scrollTo(0, ref.current.scrollHeight);
    }, [log,ref]);
    return <main><h2>Journal de combat</h2><div ref={ref}>{log}<div />{(!inFight && autoGame && (!hero.isAlive() || !enemy.isAlive())) && <div className="win">Un combat recommencera dans 10sec...</div>}</div></main>
}
export default Combat;