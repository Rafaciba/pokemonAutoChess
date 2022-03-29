import React, { Component, useState } from 'react';
import History from './history';
import { XP_TABLE } from '../../../../../models/enum';
import Elo from '../elo';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { searchName } from '../../../stores/NetworkStore';

export default function Search() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state=>state.lobby.user);
    const [currentText, setCurrentText] = useState<string>('');

    if(user){
        return <div>
        <div className="nes-field is-inline">
            <input type="text" id="inline_field" className="nes-input" placeholder="Player Name..." onChange={(e)=>{setCurrentText(e.target.value)}}/>
            <button className="nes-btn is-primary" onClick={()=>dispatch(searchName(currentText))}>Search</button>
        </div>

        <div style={{display:'flex', alignItems: 'center', marginTop: '30px'}}>
            <img src={"/assets/avatar/" + user.avatar + ".png"}/>
            <h5>{user.name}</h5>
            <Elo elo={user.elo}/>
        </div>
        <p>Level {user.level} ({user.exp} / {XP_TABLE[user.level]})</p>
        <p>Wins: {user.wins}</p>
        <p>Tipee contributor: {user.donor ? 'Yes': 'No'}</p>
        <h5>Game History</h5>
        <History history={user.history}/>
    </div>
    }
    else{
        return <div>
            <div className="nes-field is-inline">
                <input type="text" id="inline_field" className="nes-input" placeholder="Player Name..." onChange={(e)=>{setCurrentText(e.target.value)}}/>
                <button className="nes-btn is-primary" onClick={()=>dispatch(searchName(currentText))}>Search</button>
            </div>

            <h5>No player found</h5>
        </div>
    }
}