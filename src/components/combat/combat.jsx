import React, {useContext, createRef, useEffect} from "react";
import './combat.css';
import Context from '../../context';

const Combat = () => {
    const { log } = useContext(Context);
    const ref = createRef();
    useEffect(() => {
        //ref.current?.scrollIntoView();
        ref.current?.scrollTo(0, ref.current.scrollHeight);
    }, [log,ref]);
    return <main><h2>Journal de combat</h2><div ref={ref}>{log}</div></main>
}
export default Combat;