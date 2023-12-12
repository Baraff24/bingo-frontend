import React, { Component } from "react";
import "./index.scss";


class Header extends Component {
  render() {
    return (
        <div>
          <header className="py-3 border-bottom">
            <div className="d-flex flex-wrap align-items-center justify-content-center">
              <a href="https://aup.it/" target="_blank" rel="noreferrer" className="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
                <img src="https://aup.it/images/Loghi/logo150x150.png" width="50" height="50" alt=""/>
              </a>

              <ul className="list-unstyled d-flex list-ul">
                <li className="ms-3">
                  <a href="https://www.instagram.com/aup.poliba/" target="_blank" rel="noreferrer"><i className="bi bi-instagram"></i></a>
                </li>
                <li className="ms-3">
                  <a href="https://www.facebook.com/associazioneulissepolitecnico" target="_blank" rel="noreferrer"><i className="bi bi-facebook"></i></a>
                </li>
              </ul>

            </div>
          </header>
        </div>
    );
  }
}

export default Header;