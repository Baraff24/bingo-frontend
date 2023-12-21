import React, {useState, useEffect, useCallback} from "react";
import axios from "axios";
import { v4 } from 'uuid'
import {API_URL_BINGO_CARDS_LIST, API_URL_BINGO_BALLS_LIST} from "../../constants";
import "./index.scss";
import BingoCardBackgroundImage from "../../assets/images/bingo-card-background.png";
import Popup from "react-animated-popup";
//TODO: FIX PADDING NUMBER, + snow

const BingoCardsList = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState(null);
    const [balls, setBalls] = useState({ balls: [] });
    const [oldBalls, setOldBalls] = useState({ oldBalls: [] });
    const [searchTerm, setSearchTerm] = useState("");
    const [visible, setVisible] = useState(false) //POPUP

    const loadData = (searchTerm) => {
        axios
            .get(API_URL_BINGO_CARDS_LIST + "?player_id=" + searchTerm)
            .then((result) => {
                setData(result.data);
                setLoading(false);
                setError("");
            })
            .catch((error) => {
                setError(`${error}`);
                setLoading(false);
            });
    };



    const updateCardData = useCallback((ballNumbers) => {

        if(data && balls){
            let c = [];
            let tombola = true;
            data.map((whole_card) => {
                c.push(whole_card);
                whole_card.card.map((card) => {
                    card.map((cell) => {
                        ballNumbers.map((ballNumber) => {
                            cell.crossed_out === false && ballNumber !== '0' && (tombola = false);
                            //DO NOT CHANGE == TO ===, THIS WILL ALLOW AUTOMATIC VALUES CONVERSION
                            (cell.number == ballNumber) && (cell.crossed_out = true);
                        })
                    })
                })
            });
            if(tombola) {
                //setVisible(true); //Show tombola popup
            }
            return setData(c);

        }

    }, [data, balls]);

    const loadBalls = useCallback(async () => {
        try {
            const result = await axios.get(API_URL_BINGO_BALLS_LIST);
            const new_data = result.data.map(i => i.number);

            setBalls({ balls: new_data });

            if (oldBalls.oldBalls.length > 0 && balls.balls.length !== oldBalls.oldBalls.length) {
                updateCardData(new_data);
                setOldBalls({ oldBalls: new_data });
            }

            setError("");
        } catch (error) {
            setError(`${error}`);
        } finally {
            setLoading(false);
        }
    }, [balls, oldBalls, updateCardData]);

    useEffect(() => {
        // Load data
        void loadBalls();

        const timeoutId = setInterval(() => {
            // Load data every 20 seconds
            if (!loading) {
                void loadBalls();
            }
        }, 20000);

        return () => {
            // Clear interval on cleanup
            clearInterval(timeoutId);
        };
    }, [loadBalls, loading]);


    if (loading) {
        return <p>Loading...</p>;
    }

    const searchBar = (
        <form
            onSubmit={event => {
                event.preventDefault();
                if (searchTerm.trim() !== "" && searchTerm.trim().length === 6) {
                    loadData(searchTerm);
                }
            }}
        >
            <input
                className="border border-gray-300 text-black rounded py-2 px-4 focus:outline-blue-500 focus:shadow-outline"
                type="text"
                placeholder="Inserisci il tuo ID..."
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
            />
            <button
                className="ml-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                type="button"
                value={searchTerm}
                onClick={() => {
                    if (searchTerm.trim() !== "" && searchTerm.trim().length === 6) {
                        loadData(searchTerm);
                    }
                }}
            >
                Cerca
            </button>
        </form>
    );

    if (error) {
        return (

            <div>
                <div className="container">
                    {searchBar}
                </div>
                <p>There was an error loading the cards.{" "}</p>

                <button onClick={loadData}>Try again</button>
            </div>
        );
    }

    const bingoCards = data && data.map(card => (
        <div key={v4()} className="bingo-card relative bg-cover bg-center" style={{backgroundImage: `url(${BingoCardBackgroundImage})`}}>
            <Popup visible={visible} onClose={() => setVisible(false)}>
                <p className="text-red-500 font-bold">TOMBOLA</p>
            </Popup>

            <p className="margin text-white text-left font-bold">{card.card_id}</p>

            {Object.keys(card).map(cards => (
                Array.from(card[cards]).map((row, rowIndex) => (
                    <div className="bingo-card__row text-stone-900 " key={v4()}>
                        {row.map(cell => (
                            <div
                                key={v4()}
                                className={`bingo-card__cell ${cell.number === "0" ? "bingo-card__cell__empty" : ""}`}
                            >
                                <button
                                    className={`bingo-card__cell__button bingo-card__cell__number${cell.crossed_out ? "--selected" : ""}`}
                                >
                                    {cell.number}
                                </button>
                            </div>
                        ))}
                    </div>
                ))
            ))}
        </div>
    ));

    return (
        <div className="text-center">
            <div className="container mx-auto">
                {searchBar}
                {bingoCards}
            </div>
        </div>
    );
};

export default BingoCardsList;