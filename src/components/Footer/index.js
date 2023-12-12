import React, { Component } from "react";
import "./index.scss";


class Footer extends Component {
    render() {
        return (
            <div className="container">
                <footer className="py-5 footer">

                    <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
                        <p>&copy; 2023 AUP All rights reserved.
                            <br/>

                        </p>
                        <div className="ul-list">
                            <ul className="list-unstyled d-flex">
                                <li className="ms-3">
                                    <a href="https://www.instagram.com/aup.poliba/" target="_blank" rel="noreferrer"><i className="bi bi-instagram"></i></a>
                                </li>
                                <li className="ms-3">
                                    <a href="https://www.facebook.com/associazioneulissepolitecnico" target="_blank" rel="noreferrer"><i className="bi bi-facebook"></i></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
}

export default Footer;
