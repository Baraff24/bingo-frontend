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
    const [balls, setBalls] = useState(null);
    const [oldBalls, setOldBalls] = useState(null);
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
        let new_data= [];

        await axios
            .get(API_URL_BINGO_BALLS_LIST)
            .then(result => {
                result.data.map(i => new_data.push(i.number));
            })
            .catch(error => {
                setError(`${error}`);
                setLoading(false);
            });

        setBalls({balls: new_data});
        oldBalls == null &&  setOldBalls({oldBalls:new_data});
        if(oldBalls != null) {
            if (balls.balls.length !== oldBalls.oldBalls.length) {
                updateCardData(balls.balls); //Not very good fix, but it works
                setOldBalls({oldBalls:new_data}); //IMPORTANT: It will reach this point after 3 state update, so we have a delay of 3*(interval) seconds
            }
        }
        setLoading(false);
        setError("");
    }, [balls, oldBalls, updateCardData]);

    useEffect(() => {

        void loadBalls();

        // Set a timeout to load new data in 20 seconds
        const timeoutId = setTimeout(loadBalls, 20000);

        return () => {
            // Clear timeout if the component is unmounted
            clearTimeout(timeoutId);
        };
    }, [loadBalls]);


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