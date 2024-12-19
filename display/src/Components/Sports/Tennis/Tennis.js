import React, { useEffect } from "react";
import "./Tennis.css";

function Tennis({ gameState: incomingGameState }) {
  const gameState = incomingGameState || {
    "Sport": "Tennis",
    "Timer": {
      "Value": "00:00"
    },
    "Set": 4,
    "Home": {
      "TeamName": "Joueur 1",
      "Points": 12,
      "Service": 1,
      "Winner": false,
      "SetsWon": 2,
      "PointsInSet": [6, 4, 7, 2],
    },
    "Guest": {
      "TeamName": "Joueur 2",
      "Points": 0,
      "Service": 0,
      "Winner": false,
      "SetsWon": 1,
      "PointsInSet": [4, 6, 6, 0],
    }
  };

  const [homeFontSize, setHomeFontSize] = React.useState("40px");
  const [guestFontSize, setGuestFontSize] = React.useState("40px");
  const [currentSet, setCurrentSet] = React.useState(1);
  const [homePointsSet5, setHomePointsSet5] = React.useState(0);
  const [guestPointsSet5, setGuestPointsSet5] = React.useState(0);

  // Handle special scoring when points reach 99
  if (gameState?.Home?.Points === 99 && gameState?.Guest?.Points === 98) {
    gameState.Home.Points = "A";
    gameState.Guest.Points = "-";
  } else if (gameState?.Guest?.Points === 99 && gameState?.Home?.Points === 98) {
    gameState.Guest.Points = "A";
    gameState.Home.Points = "-";
  }

  useEffect(() => {
    if (gameState?.Home?.TeamName !== undefined || gameState?.Guest?.TeamName !== undefined) {
      setHomeFontSize(getFontSize(gameState?.Home?.TeamName));
      setGuestFontSize(getFontSize(gameState?.Guest?.TeamName));
    }
  }, [incomingGameState]);

  function calculateCurrentSet(homeSetsWon, guestSetsWon) {
    const totalSets = homeSetsWon + guestSetsWon + 1;
    return gameState?.Home?.Winner || gameState?.Guest?.Winner
      ? totalSets - 1
      : totalSets > 5
        ? 5
        : totalSets;
  }

  useEffect(() => {
    setCurrentSet(calculateCurrentSet(gameState?.Home?.SetsWon, gameState?.Guest?.SetsWon));
  }, [incomingGameState]);

  useEffect(() => {
    if (gameState?.Home?.Points === 6 || gameState?.Guest?.Points === 6) {
      setHomePointsSet5(gameState?.Home?.Points);
      setGuestPointsSet5(gameState?.Guest?.Points);
    }
  }, [gameState]);

  function getFontSize(name) {
    if (name.length <= 7) {
      return "40px"; // Taille normale
    } else if (name.length <= 9) {
      return "35px"; // Toujours un peu plus petit
    }
  }

  function getFontSizeScore(point) {
    return "35px";
  }

  // Determine the color of the service dot for Home and Guest
  const homeServiceDotColor = gameState?.Home?.Service === 1 ? 1 : 0;
  const guestServiceDotColor = gameState?.Guest?.Service === 1 ? 1 : 0;

  // Conditionally apply blinking class
  const homeBlinkClass = gameState?.Home?.Winner ? "blinking" : "";
  const guestBlinkClass = gameState?.Guest?.Winner ? "blinking" : "";

const renderSetScores = () => {
  return (
    <>
      {gameState?.Set > 3 ? (
        <>
        <td>
          <div className="set-score">{gameState.Home.SetsWon || "0"}</div>
          <div className="middle middle-text"> SETS </div>
          <div className="set-score">{gameState.Guest.SetsWon || "0"}</div>

        </td>
        <td>
          <div className="set-score">{gameState.Home.PointsInSet[gameState.Home.PointsInSet.length-1] || "0"}</div>
          <div className="middle middle-text">S{gameState.Home.PointsInSet.length||"0"}</div>
          <div className="set-score">{gameState.Guest.PointsInSet[gameState.Guest.PointsInSet.length-1] || "0"}</div>
          
        </td>
        </>
      ) : (
         Array.from({ length: gameState.Set }, (_, i) => (
          <td key={i}>
            <div className="set-score">{gameState.Home.PointsInSet[i] || "0"}</div>
            <div className="middle middle-text">S{i+1}</div>
            <div className="set-score">{gameState.Guest.PointsInSet[i] || "0"}</div>
          </td>
        ))
       
      )}
    </>
  );
};



  return (

      <div className="container-tennis">
      
        <table className="score-tennis">
          <tbody>
            <tr>
              <td >
                <div className={`player-name ${homeBlinkClass}`} style={{ fontSize: homeFontSize }}>
                  {gameState?.Home?.TeamName || "player1"}
                </div>
                  <div className="middle"> </div>
                  <div className={`player-name ${guestBlinkClass}`} style={{ fontSize: guestFontSize }}>
                  {gameState?.Guest?.TeamName || "player2"}
                </div>
              </td>
               <td>
                <div className="dot" style={{ opacity: homeServiceDotColor ? "1" : "0" }}></div>
                 <div className="middle"> </div>
                  <div className="dot" style={{ opacity: guestServiceDotColor ? "1" : "0" }}></div>
                  
              </td>
               <td>
                <div className="point-score set-score point score">{gameState?.Home?.Points || "0"}</div>
                <div className="middle middle-text"> POINTS </div>
                <div className="point-score set-score point score">{gameState?.Guest?.Points || "0"}</div>
              </td>
               
    {renderSetScores(gameState?.Home?.PointsInSet, gameState?.Home?.Points)}
           
            </tr>
           
           
          </tbody>
        </table>
        <div className="footer-tennis">
          <img  className="logo-scortenn" src="LOGO_scortenn.png" />
          <div className="timer">{gameState?.Timer?.Value || "00:00"}</div>
        </div>
      </div>

  );
}

export default Tennis;
