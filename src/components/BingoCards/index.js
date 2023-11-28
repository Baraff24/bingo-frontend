import React, {useState, useEffect} from "react";
import axios from "axios";
import { v4 } from 'uuid'
import { API_URL_BINGO_CARDS_LIST, API_APP_URL } from "../../constants";
import "./index.scss";
import BingoCardBackgroundImage from "../../assets/images/bingo-card-background.png";
import Popup from "react-animated-popup";
//TODO: FIX PADDING NUMBER, + snow

const BingoCardsList = () => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [data, setData] = useState(null);
    const [balls, setBalls] = useState(null);
    const [time, setTimer] = useState(Date.now());
    const [oldBalls, setOldBalls] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [visible, setVisible] = useState(false) //POPUP
    const [popupText, setPopupText] = useState("") //POPUP



    const updateCardData = (ballNumbers) => {

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
                            (cell.number === ballNumber) && (cell.crossed_out = true);
                        })
                    })
                })
            });
            if(tombola) {
                //setVisible(true); //Show tombola popup
            }
            return setData(c);

        }

    }

    const loadBalls = async () => {
        let new_data =  [];

        await axios
            .get(API_APP_URL + "/balls-list/")
            .then(result => {
                result.data.map(i => new_data.push(i.number));
            })
            .catch(error => {
                setError(`${error}`);
                setLoading(false);
            });

        setBalls({balls: new_data});
        oldBalls == null &&  setOldBalls({oldBalls:new_data});
        if(oldBalls != null ) {
            if (balls.balls.length !== oldBalls.oldBalls.length) {
                const numbers = []
                //THIS DOES NOT WORK, FOR NOW I PUSH A BAD FIX let difference = balls.balls.filter(x => !oldBalls.oldBalls.includes(x));
                //balls.balls.map(k => (numbers.push(k)));
                //console.log(new_data, numbers, balls)
                //numbers.push(balls.balls[balls.balls.length - 1])
                updateCardData(balls.balls); //Not very good fix, but it works
                setOldBalls({oldBalls:new_data}); //IMPORTANT: It will reach this point after 3 state update, so we have a delay of 3*(interval) seconds
            }
        }
        setLoading(false);
        setError("");
    }


    const loadData = (searchTerm) => {
        axios
            .get(API_URL_BINGO_CARDS_LIST + "?player_id=" + searchTerm)
            .then(result => {
                setData(result.data);
                setLoading(false);
                setError("");
            })
            .catch(error => {
                setError(`${error}`);
                setLoading(false);
            });

    };

    //data shall update only when is null, otherwise we waste server resource
    useEffect(() => {
        (data == null) && loadData();
        void loadBalls();
    }, [searchTerm]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(Date.now());
        }, 5000);
        void loadBalls();
        return() => {
            clearInterval(interval);
        }
    }, [time]);

    if (loading) {
        return <p>Loading...</p>;
    }

    const searchBar = (
        <div className="search-bar">
            <form
                className="row g-2"
                onSubmit={event => {
                    event.preventDefault();
                    loadData(searchTerm);}
                }
            >
                <div className="col-auto">
                    <input
                        className="form-control-lg mr-sm-4 text-primary "
                        type="text"
                        placeholder="Search for a Player ID"
                        value={searchTerm}
                        onChange={event => setSearchTerm(event.target.value)}
                    />
                </div>
                <div className="col-auto">
                    <button type="submit" className="btn-lg btn-outline-success-primary bi-card-list bg-primary text-white hover"> Search</button>
                </div>
            </form>
        </div>
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

    const bingoCards = data && data.map(card => {
        // TODO: IMPLEMENT ALIGNMENT IN CARD_NUMBER, NOW FOR NUMBER >10 is bad

        return (

            <div key={v4()} className="bingo-card"
                 style={{
                     backgroundImage: 'url(' + BingoCardBackgroundImage + ')',
                     backgroundPosition: "Center",
                     backgroundSize: "cover",
                 }}>
                <Popup visible={visible} onClose={() => setVisible(false)}>
                    <p style={{color:'red'}}>TOMBOLA</p>
                </Popup>

                <p className="margin" style={{color: "white", textAlign:"left", fontWeight:"bolder"}}>{card.card_id}</p>
                {Object.keys(card).map(cards => {
                    return (
                        Array.from(card[cards]).map((card) => {
                            return (

                                <div className="bingo-card__row " key={v4()}>
                                    {Array.from(card).map((card) => {
                                        if (card.number === "0") {
                                            return (
                                                <div className="bingo-card__cell bingo-card__cell__empty" key={v4()}>
                                                    {card.number}
                                                </div>
                                            )
                                        }
                                        else {
                                            if (card.crossed_out === true) {
                                                return (
                                                    <div className="bingo-card__cell" key={v4()}>
                                                        <button className="bingo-card__cell__button bingo-card__cell__number--selected">{card.number}</button>
                                                    </div>
                                                )
                                            }
                                            else {
                                                return (
                                                    <div className="bingo-card__cell" key={v4()}>
                                                        <button className="bingo-card__cell__button bingo-card__cell__number">{card.number}</button>
                                                    </div>
                                                )
                                            }
                                        }
                                    })}
                                </div>


                            );
                        }))})}
            </div>
        );
    });


    return (

        <div>
            <div align="center">
                {searchBar}
                <div className="container">
                    {bingoCards}
                </div>
            </div>
        </div>
    );
}

export default BingoCardsList;