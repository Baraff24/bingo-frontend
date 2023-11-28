import React, { Component } from "react";
import "./index.scss";
import BingoCardsList from "../BingoCards";
import Snowfall from 'react-snowfall'

class Homepage extends Component {
    render() {
        return (
            <div className="home-container" style={{
                minHeight: 1000,
            }}>
                <h1>Homepage</h1>
                <p>Inserisci il tuo ID all'interno della barra di ricerca</p>
                <div className="row-md-10">
                    <Snowfall
                        style={{
                            position: 'fixed',
                            width: '100vw',
                            height: '100vh',
                        }}
                    />
                    <BingoCardsList />
                </div>
            </div>
        );
    }
}

export default Homepage;