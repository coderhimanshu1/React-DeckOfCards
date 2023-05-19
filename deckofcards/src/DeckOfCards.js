import React, { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";

const DeckOfCards = () => {
  const apiUrl = "https://deckofcardsapi.com/api/deck";

  const [deck, setDeck] = useState(null);
  const [card, setCard] = useState([]);
  const [draw, setDraw] = useState(false);

  useEffect(() => {
    async function drawDeck() {
      const newDeck = await axios.get(`${apiUrl}/new/shuffle/`);
      setDeck(newDeck.data);
    }

    drawDeck();
  }, []);

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
        console.log(newCard);

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

  const triggerDraw = () => {
    setDraw(true);
  };

  const cards = card.map((c) => (
    <Card key={c.id} name={c.name} image={c.image} />
  ));

  return (
    <div>
      <h3>Deck of Cards Game</h3>
      <button onClick={triggerDraw}>Add Card</button>
      <div>{cards}</div>
    </div>
  );
};

export default DeckOfCards;
