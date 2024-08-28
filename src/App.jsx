import React, { useState, useEffect, useRef } from "react";
import LoadingAnimation from "./LoadingAnimation";
import NarutoCover from "./assets/NarutoCover.jpg";
import "./App.css";

function App() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const flipRef = useRef([]);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  function shuffle(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }

  const handleFlip = () => {
    if (gameOver) return;

    flipRef.current.forEach((card) => {
      if (card) {
        card.classList.add("flipped");
      }
    });

    setTimeout(() => {
      setCharacters(shuffle(characters));
      setTimeout(() => {
        flipRef.current.forEach((card) => {
          if (card) {
            card.classList.remove("flipped");
          }
        });
      }, 200);
    }, 500);
  };

  const handleSelect = (id) => {
    if (gameOver) return;

    setSelected((prevSelected) => {
      if (!prevSelected.includes(id)) {
        setScore((s) => s + 1);
        return [...prevSelected, id];
      } else {
        handleHighScore(score);
        setGameOver(true);
        return prevSelected;
      }
    });
  };

  function handleHighScore(score) {
    setHighScore((s) => (score > s ? score : s));
  }

  const handleReplay = () => {
    setScore(0);
    setSelected([]);
    setGameOver(false);
    setCharacters(shuffle(characters));
  };

  useEffect(() => {
    setLoading(true);
    fetch("https://dattebayo-api.onrender.com/akatsuki?limit=15")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const updatedAkatsuki = [...data.akatsuki];
        updatedAkatsuki.splice(8, 1);
        setCharacters(updatedAkatsuki);
      })
      .catch((error) => {
        console.error("Error fetching characters:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div>
      <h1 id="game-title">Memory Card</h1>
      <div className="score-div">
        <p>Score: {score}</p>
        <p>High Score: {highScore}</p>
      </div>
      {gameOver && (
        <div className="game-over">
          <p>Game Over!</p>
          <button onClick={handleReplay}>Replay</button>
        </div>
      )}
      <div className={`container ${gameOver ? "game-over-container" : ""}`}>
        {characters.map((character, index) => (
          <div
            key={character.id}
            className={"flip-card"}
            onClick={() => {
              handleFlip(index);
              handleSelect(character.id);
            }}
            ref={(el) => (flipRef.current[index] = el)}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img
                  src={character.images[0]}
                  className="characters"
                  alt={character.name}
                />
                <p className="character-name">{character.name}</p>
              </div>
              <div className="flip-card-back">
                <img
                  src={NarutoCover}
                  alt="Naruto Cover"
                  className="back-image"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
