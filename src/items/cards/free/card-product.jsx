import * as React from "react";
import { Container, Button } from "@mui/material";

import './css/card-product.css';

export default function Card_Product({}) {

    const onData = []

  return (
      <Container >
        <div className="container">
                <div className="card-1 card-div">
                    <div className="like-icon-div">
                        <label for="card-1-like" className="like-icon-div-child">
                            <input type="checkbox" id="card-1-like" />
                            <i className="far fa-heart heart-empty"></i>
                            <i className="fas fa-heart heart-fill"></i>
                        </label>
                    </div>
                    
                    <div className="gow-img-div img-div">
                        <img src="https://github.com/gerrardNwoke/codePen-imgs/blob/main/imgs/gow-figurine.png?raw=true" alt="god-of-war-figurine" />
                    </div>
                    <div className="text-container">
                    
                        <h2 className="item-name">Kratos and Artreus Statue - God Of War</h2>
                        <p className="date"> Departure date: 31/03/2021 </p>
                        <div className="pricing-and-cart">
                            <div className="pricing">
                                <p className="previous-price">$999</p>
                                <p className="current-price">$599</p>
                            </div>
                            <i className="fas fa-shopping-cart"></i>
                        </div>
                    </div>
                </div>

                <div className="card-2 card-div">
                    <div className="like-icon-div">
                        <label for ="card-2-like" className="like-icon-div-child">
                            <input type="checkbox" id="card-2-like" />
                            <i className="far fa-heart heart-empty"></i>
                            <i className="fas fa-heart heart-fill"></i>
                        </label>
                    </div>
                    <div className="sekiro-img-div img-div">
                        <img src="https://github.com/gerrardNwoke/codePen-imgs/blob/main/imgs/sekiro-figurine.png?raw=true" alt="sekiro-figurine" />
                    </div>
                    <div className="text-container">
                        <h2 className="item-name">Sekiro Statue - Sekiro: Shadows Die Twice</h2>
                        <p className="date"> Departure date: 31/03/2021 </p>
                        <div className="pricing-and-cart">
                            <div className="pricing">
                                <p className="previous-price">$999</p>
                                <p className="current-price">$799</p>
                            </div>
                            <i className="fas fa-shopping-cart"></i>
                        </div>
                    </div>
                </div>

                <div className="card-3 card-div">
                    <div className="like-icon-div">
                        <label for="card-3-like" className="like-icon-div-child">
                            <input type="checkbox" id="card-3-like" />
                            <i className="far fa-heart heart-empty"></i>
                            <i className="fas fa-heart heart-fill"></i>
                        </label>
                    </div>
                    <div className="dazai-img-div img-div">
                        <img src="https://github.com/gerrardNwoke/codePen-imgs/blob/main/imgs/dazai-figurine.png?raw=true" alt="sekiro-figurine" />
                    </div>
                    <div className="text-container">
                        <h2 className="item-name">Osamu Dazai Funko Pop - Bungou Stray Dogs</h2>
                        <p className="date"> Departure date: 31/03/2021 </p>
                        <div className="pricing-and-cart">
                            <div className="pricing">
                                <p className="previous-price">$449</p>
                                <p className="current-price">$279</p>
                            </div>
                            <i className="fas fa-shopping-cart"></i>
                        </div>
                    </div>
                </div>

                <div className="card-4 card-div">
                    <div className="like-icon-div">
                        <label for="card-4-like" className="like-icon-div-child">
                            <input type="checkbox" id="card-4-like" />
                            <i className="far fa-heart heart-empty"></i>
                            <i className="fas fa-heart heart-fill"></i>
                        </label>
                    </div>
                    <div className="u4-img-div img-div">
                        <img src="https://github.com/gerrardNwoke/codePen-imgs/blob/main/imgs/u4-figurine.png?raw=true" alt="u4-figurine" />
                    </div>
                    <div className="text-container">
                        <h2 className="item-name">Nathan Drake Statue - Uncharted 4: A Thief's End</h2>
                        <p className="date"> Departure date: 31/03/2021 </p>
                        <div className="pricing-and-cart">
                            <div className="pricing">
                                <p className="previous-price">$759</p>
                                <p className="current-price">$499</p>
                            </div>
                            <i className="fas fa-shopping-cart"></i>
                        </div>
                    </div>
                </div>
            </div>
      </Container>
  );
}