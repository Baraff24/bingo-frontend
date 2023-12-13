import React, { Component } from "react";
import BingoCardsList from "../BingoCards";
import Snowfall from 'react-snowfall';
import "./index.scss";

class Homepage extends Component {
    render() {
        return (
            <div className="space-background" style={{
                minHeight: 1000,
            }}>
                <div className="min-h-screen flex justify-center">
                    <Snowfall
                        style={{
                            position: 'fixed',
                            width: '100vw',
                            height: '100vh',
                        }}
                    />
                    <div className="text-center mt-24">
                        <h1 className="text-4xl font-bold mb-4">Benvenuto alla Tombola AUP 2023</h1>
                        <p className="text-lg">Inserisci il tuo ID all'interno della barra di ricerca</p>
                        <div className="mt-10">
                            <BingoCardsList />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Homepage;