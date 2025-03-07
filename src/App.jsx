import { useState, useEffect } from "react";
import "./App.css";
import CardGrid from "./components/CardGrid";
import Scoreboard from "./components/Scoreboard";
import Modal from "./components/Modal";
import logo from "../src/assets/ghibli-films/ghibli.svg";
import loadingImage from "../src/assets/ghibli-films/studio-ghibli.gif";
import customImages from "./components/CustomImages";

function App() {
  const [cards, setCards] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [selectedCards, setSelectedCards] = useState([]);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setLoading(false);
  }, 2000);

  fetch("https://ghibliapi.vercel.app/films")
    .then((response) => response.json())
    .then((data) => {
      const selectedFilmIDs = Object.keys(customImages);

      const filteredFilms = data
        .filter((film) => selectedFilmIDs.includes(film.id))
        .map((film) => ({
          id: film.id,
          title: film.title,
          image:
            customImages[film.id] ||
            film.movie_banner ||
            "https://via.placeholder.com/300",
        }));

      setCards(shuffleArray([...new Set(filteredFilms)]));
    })
    .catch((error) => console.error("Error fetching data:", error));

  return () => clearTimeout(timer);
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
    <div className="app-container">
      {loading ? (
        <div className="loading-screen">
          <div className="loading-header">
            <img src={logo} alt="Game Logo" className="logo" />
            <h1>Memory Game</h1>
            </div>
            <img src={loadingImage} alt="Loading" className="loading-image" />
        </div>
      ) : (
        <div className="main-game-content">
          <div className="header-container">
            <img src={logo} alt="Game Logo" className="logo" />
            <h1>Memory Game</h1>
          </div>
  
          <h2>
            Test your memory! Click on each movie only once. If you click the
            same movie twice, the game resets.
            <br />
            Try to select all movies without repeating any!
          </h2>
  
          <Scoreboard score={score} bestScore={bestScore} />
          <CardGrid cards={cards} handleCardClick={handleCardClick} />
          {modalMessage && (
            <Modal message={modalMessage} onClose={() => setModalMessage("")} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;