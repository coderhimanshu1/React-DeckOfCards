import React, { useEffect, useState, useRef } from "react";
import Card from "./Card";
import "./DeckOfCards.css";
import axios from "axios";

const DeckOfCards = () => {
  const apiUrl = "https://deckofcardsapi.com/api/deck";

  const [deck, setDeck] = useState(null);
  const [card, setCard] = useState([]);
  const [draw, setDraw] = useState(false);
  const [autoDraw, setAutoDraw] = useState(false);
  const timerRef = useRef(null);

  //   Handle new shuffled deck
  useEffect(() => {
    async function drawDeck() {
      const newDeck = await axios.get(`${apiUrl}/new/shuffle/`);
      setDeck(newDeck.data);
    }

    drawDeck();
  }, []);

  //   Handle Draw card on click
  useEffect(() => {
    async function drawCard() {
      if (draw && deck) {
        const { deck_id } = deck;
        const res = await axios.get(`${apiUrl}/${deck_id}/draw/`);

        if (res.data.remaining === 0) {
          setDraw(false);
          alert("no cards remaining!");
        }

        const newCard = res.data.cards[0];

        setCard((prevCards) => [
          ...prevCards,
          {
            id: newCard.code,
            name: newCard.suit + " " + newCard.value,
            image: newCard.image,
          },
        ]);

        setDraw(false);
      }
    }

    drawCard();
  }, [draw, deck]);

  //   Handle Auto draw card
  useEffect(() => {
    async function autoDrawCard() {
      let { deck_id } = deck;

      try {
        let drawRes = await axios.get(`${apiUrl}/${deck_id}/draw/`);

        if (drawRes.data.remaining === 0) {
          setAutoDraw(false);
          throw new Error("no cards remaining!");
        }

        const card = drawRes.data.cards[0];

        setCard((d) => [
          ...d,
          {
            id: card.code,
            name: card.suit + " " + card.value,
            image: card.image,
          },
        ]);
      } catch (err) {
        alert(err);
      }
    }
    // autoDraw card every second
    if (autoDraw && !timerRef.current) {
      timerRef.current = setInterval(async () => {
        await autoDrawCard();
      }, 1000);
    }

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoDraw, setAutoDraw, deck]);

  //   Toggle autoDraw status
  const toggleAutoDraw = () => {
    setAutoDraw((auto) => !auto);
  };

  //   Draw card on 'Add Card' button click
  const triggerDraw = () => {
    setDraw(true);
  };
  // Store cards in array
  const cards = card.map((c) => (
    <Card key={c.id} name={c.name} image={c.image} />
  ));

  return (
    <div className="DeckOfCards">
      <h3>Deck of Cards Game</h3>

      <button onClick={triggerDraw} className="DeckOfCards-btn">
        Add Card
      </button>

      <button className="DeckOfCards-btn" onClick={toggleAutoDraw}>
        {autoDraw ? "STOP" : "KEEP"} DRAWING FOR ME!
      </button>
      <div className="DeckOfCards-area">{cards}</div>
    </div>
  );
};

export default DeckOfCards;
