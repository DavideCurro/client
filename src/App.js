import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [games, setGames] = useState([]); // Lista dei giochi
  const [selectedGame, setSelectedGame] = useState(""); // Gioco selezionato
  const [gameInfo, setGameInfo] = useState(null); // Info del gioco
  const [error, setError] = useState(""); // Gestione degli errori

  // Recupera l'elenco dei giochi dall'API
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("http://localhost:3002/results"); // Endpoint per ottenere i giochi
        const data = await response.json();
        const uniqueGames = [...new Set(data.map((game) => game.Game))]; // Rimuove duplicati
        setGames(uniqueGames);
      } catch (err) {
        console.error("Error fetching games:", err);
        setError("Error fetching game list.");
      }
    };

    fetchGames();
  }, []);

  // Recupera i dettagli del gioco selezionato
  const fetchGameInfo = async () => {
    setError("");
    setGameInfo(null);
    try {
      const response = await fetch(
        `http://localhost:3002/results?game=${selectedGame}`
      );
      if (!response.ok) throw new Error("Game not found.");
      const data = await response.json();
      setGameInfo(data[0]); // Mostra solo il primo risultato
    } catch (err) {
      console.error("Error fetching game info:", err);
      setError("Error fetching game details.");
    }
  };

  return (
    <div className="App">
      <h1>Twitch Global Data</h1>
      <div className="content">
        <select
          className="dropdown"
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
        >
          <option value="">Select a Game</option>
          {games.map((game, index) => (
            <option key={index} value={game}>
              {game}
            </option>
          ))}
        </select>
        <button
          className="fetch-button"
          onClick={fetchGameInfo}
          disabled={!selectedGame}
        >
          Show Info
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {gameInfo && (
  <div className="game-info">
    <h2>Game: {gameInfo.Game}</h2>
    <p>Rank: {gameInfo.Rank}</p>
    <p>Hours Watched: {gameInfo.Hours_watched}</p>
    <p>Hours Streamed: {gameInfo.Hours_streamed}</p>
    <p>Peak Viewers: {gameInfo.Peak_viewers}</p>
    <p>Peak Channels: {gameInfo.Peak_channels}</p>
    <p>Average Viewers: {gameInfo.Avg_viewers}</p>
    <p>Average Channels: {gameInfo.Avg_channels}</p>
    <p>Average Viewer Ratio: {gameInfo.Avg_viewer_ratio}</p>
    <p>Streamers: {gameInfo.Streamers}</p>
    <p>Date: {gameInfo.Month}/{gameInfo.year}</p>
  </div>
)}

    </div>
  );
}

export default App;
