import { useState, useEffect } from "react";
import "./App.css";
import CardGrid from "./components/CardGrid";
import Scoreboard from "./components/Scoreboard";
import Modal from "./components/Modal";

const customImages = {
  "2baf70d1-42bb-4437-b551-e5fed5a87abe": "src/assets/ghibli-films/castle-in-the-sky.jpg",
  "12cfb892-aac0-4c5b-94af-521852e46d6a": "src/assets/ghibli-films/grave-of-the-fireflies.jpg",
  "58611129-2dbc-4a81-a72f-77ddfc1b1b49": "src/assets/ghibli-films/my-neighbor-totoro.jpg",
  "ea660b10-85c4-4ae3-8a5f-41cea3648e3e": "src/assets/ghibli-films/kiki.jpg",
  "4e236f34-b981-41c3-8c65-f8c9000b94e7": "src/assets/ghibli-films/only-yesterday.jpg",
  "ebbb6b7c-945c-41ee-a792-de0e43191bd8": "src/assets/ghibli-films/porco-rosso.jpg",
  "1b67aa9a-2e4a-45af-ac98-64d6ad15b16c": "src/assets/ghibli-films/pom-poko.jpg",
  "ff24da26-a969-4f0e-ba1e-a122ead6c6e3": "src/assets/ghibli-films/whisper-of-the-heart.jpg",
  "0440483e-ca0e-4120-8c50-4c8cd9b965d6": "src/assets/ghibli-films/princess-mononoke.jpg",
  "dc2e6bd1-8156-4886-adff-b39e6043af0c": "src/assets/ghibli-films/spirited-away.jpg",
  "cd3d059c-09f4-4ff3-8d63-bc765a5184fa": "src/assets/ghibli-films/howls-moving-castle.jpg",
  "90b72513-afd4-4570-84de-a56c312fdf81": "src/assets/ghibli-films/the-cat-returns.jpg",
  "112c1e67-726f-40b1-ac17-6974127bb9b9": "src/assets/ghibli-films/tales-from-earthsea.jpg",
  "758bf02e-3122-46e0-884e-67cf83df1786": "src/assets/ghibli-films/ponyo.jpg",
  "2de9426b-914a-4a06-a3a0-5e6d9d3886f6": "src/assets/ghibli-films/arrietty.jpg",
  "45db04e4-304a-4933-9823-33f389e8d74d": "src/assets/ghibli-films/poppy-hill.jpg",
  "67405111-37a5-438f-81cc-4666af60c800": "src/assets/ghibli-films/the-wind-rises.jpg",
  "578ae244-7750-4d9f-867b-f3cd3d6fecf4": "src/assets/ghibli-films/princess-kaguya.jpg",
};

function App() {
  const [cards, setCards] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [selectedCards, setSelectedCards] = useState([]);
  const [modalMessage, setModalMessage] = useState("");
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  useEffect(() => {
    fetch("https://ghibliapi.vercel.app/films")
      .then((response) => response.json())
      .then((data) => {
        const selectedFilmIDs = Object.keys(customImages);

        const filteredFilms = data
          .filter((film) => selectedFilmIDs.includes(film.id))
          .map((film) => ({
            id: film.id,
            title: film.title,
            image: customImages[film.id] || film.movie_banner || "https://via.placeholder.com/300",
          }));

        setCards(shuffleArray([...new Set(filteredFilms)]));
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  function handleCardClick(id) {
    if (selectedCards.includes(id)) {
      setModalMessage("Game Over! Try Again.");
      setScore(0);
      setSelectedCards([]);
    } else {
      const newScore = score + 1;
      setScore(newScore);
      setBestScore(Math.max(newScore, bestScore));
      setSelectedCards([...selectedCards, id]);

      if (newScore === Object.keys(customImages).length) {
        setModalMessage("You Won!");
      }
    }
    setCards(shuffleArray(cards));
  }

  return (
    <div>
      <h1>Ghibli Film Memory Game</h1>
      <button onClick={() => setIsRulesOpen(true)}>Rules</button>
      <Scoreboard score={score} bestScore={bestScore} />
      <CardGrid cards={cards} handleCardClick={handleCardClick} />
      {modalMessage && <Modal message={modalMessage} onClose={() => setModalMessage("")} />}
      {isRulesOpen && (
        <Modal
          message="Click on a movie only once! Try to remember which ones you've already selected."
          onClose={() => setIsRulesOpen(false)}
        />
      )}
    </div>
  );
}

export default App;