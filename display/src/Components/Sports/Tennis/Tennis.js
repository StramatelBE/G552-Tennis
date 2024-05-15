import React, { useEffect } from "react";
import "./Tennis.css";

function Tennis({ gameState: incomingGameState }) {
  const gameState = incomingGameState || {};

  const [homeFontSize, setHomeFontSize] = React.useState('30px');
  const [guestFontSize, setGuestFontSize] = React.useState('30px');

  const [currentSet, setCurrentSet] = React.useState(1);

  // Handle special scoring when points reach 17
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
    return (gameState?.Home?.Winner || gameState?.Guest?.Winner) ? totalSets - 1 : totalSets > 5 ? 5 : totalSets;
  }

  useEffect(() => {
    setCurrentSet(calculateCurrentSet(gameState?.Home?.SetsWon, gameState?.Guest?.SetsWon));
  }, [incomingGameState]);

  function getFontSize(name) {
    if (name.length <= 7) {
      return '30px'; // Taille normale
    }
    else if (name.length <= 9) {
      return '26px'; // Toujours un peu plus petit
    }
  }

  function getFontSizeScore(point) {
    return '38px';
  }

  // Determine the color of the service dot for Home and Guest
  const homeServiceDotColor = gameState?.Home?.Service === 1 ? "darkred" : "#005239";
  const guestServiceDotColor = gameState?.Guest?.Service === 1 ? "darkred" : "#005239";

  // Conditionally apply blinking class
  const homeBlinkClass = gameState?.Home?.Winner ? "blinking" : "";
  const guestBlinkClass = gameState?.Guest?.Winner ? "blinking" : "";

  return (
    <div className="scoreboard">
      <div className="container-tennis">
        <div className="timer">{gameState?.Timer?.Value || "00:00"}</div>
        <table className="score-tennis">
          <tr>
            <td><div className={`player-name ${homeBlinkClass}`} style={{ fontSize: homeFontSize }}>{gameState?.Home?.TeamName || "player1"}</div></td>
            <td><div className="dot" style={{ backgroundColor: `${homeServiceDotColor}`, marginLeft: '10px' }}></div></td>
            <td><div className="set-score">{gameState?.Home?.GameInSet || "0"}</div></td>
            <td><div className="set-score point score">{gameState?.Home?.Points || "0"}</div></td>
            {gameState.Sport === "Tennis" && (gameState?.Guest?.PointsInSet[0] !== 0 || gameState?.Home?.PointsInSet[0] !== 0) && <td><div style={{ fontSize: getFontSizeScore(gameState?.Home?.PointsInSet[0]) }} className="set-score">{gameState?.Home?.PointsInSet[0]}</div></td>}
            {gameState.Sport === "Tennis" && (gameState?.Guest?.PointsInSet[1] !== 0 || gameState?.Home?.PointsInSet[1] !== 0) && <td><div style={{ fontSize: getFontSizeScore(gameState?.Home?.PointsInSet[1]) }} className="set-score">{gameState?.Home?.PointsInSet[1]}</div></td>}
            {gameState.Sport === "Tennis" && (gameState?.Guest?.PointsInSet[2] !== 0 || gameState?.Home?.PointsInSet[2] !== 0) && <td><div style={{ fontSize: getFontSizeScore(gameState?.Home?.PointsInSet[2]) }} className="set-score">{gameState?.Home?.PointsInSet[2]}</div></td>}
            {gameState.Sport === "Tennis" && (gameState?.Guest?.PointsInSet[3] !== 0 || gameState?.Home?.PointsInSet[3] !== 0) && <td><div style={{ fontSize: getFontSizeScore(gameState?.Home?.PointsInSet[3]) }} className="set-score">{gameState?.Home?.PointsInSet[3]}</div></td>}
            {gameState.Sport === "Tennis" && currentSet === 5 && <td><div style={{ fontSize: getFontSizeScore(gameState?.Home?.Points) }} className="set-score">{gameState?.Home?.Points}</div></td>}
          </tr>
          <tr>
            <td><div className={`player-name `} style={{ fontSize: guestFontSize, visibility: "hidden" }}>{gameState?.Home?.TeamName || "player1"}</div> </td>
            <td><div className="dot" ></div></td>
            <td><div className=" set-text" >{currentSet || "1"}</div></td>
            <td><div className=" set-text point" >PTS</div></td>
            {gameState.Sport === "Tennis" && (gameState?.Guest?.PointsInSet[0] !== 0 || gameState?.Home?.PointsInSet[0] !== 0) && <td><div className=" set-text" >S1</div></td>}
            {gameState.Sport === "Tennis" && (gameState?.Guest?.PointsInSet[1] !== 0 || gameState?.Home?.PointsInSet[1] !== 0) && <td><div className=" set-text" >S2</div></td>}
            {gameState.Sport === "Tennis" && (gameState?.Guest?.PointsInSet[2] !== 0 || gameState?.Home?.PointsInSet[2] !== 0) && <td><div className=" set-text" >S3</div></td>}
            {gameState.Sport === "Tennis" && (gameState?.Guest?.PointsInSet[3] !== 0 || gameState?.Home?.PointsInSet[3] !== 0) && <td><div className=" set-text" >S4</div></td>}
            {gameState.Sport === "Tennis" && currentSet === 5 && <td><div className=" set-text" >S5</div></td>}
          </tr>
          <tr>
            <td><div className={`player-name ${guestBlinkClass}`} style={{ fontSize: guestFontSize }}>{gameState?.Guest?.TeamName || "player2"}</div></td>
            <td><div className="dot" style={{ backgroundColor: `${guestServiceDotColor}`, marginLeft: '10px' }}></div></td>
            <td><div className="set-score">{gameState?.Guest?.GameInSet || "0"}</div></td>
            <td><div className="set-score point score">{gameState?.Guest?.Points || "0"}</div></td>
            {gameState.Sport === "Tennis" && (gameState?.Guest?.PointsInSet[0] !== 0 || gameState?.Home?.PointsInSet[0] !== 0) && <td><div style={{ fontSize: getFontSizeScore(gameState?.Guest?.PointsInSet[0]) }} className="set-score">{gameState?.Guest?.PointsInSet[0]}</div></td>}
            {gameState.Sport === "Tennis" && (gameState?.Guest?.PointsInSet[1] !== 0 || gameState?.Home?.PointsInSet[1] !== 0) && <td><div style={{ fontSize: getFontSizeScore(gameState?.Guest?.PointsInSet[1]) }} className="set-score">{gameState?.Guest?.PointsInSet[1]}</div></td>}
            {gameState.Sport === "Tennis" && (gameState?.Guest?.PointsInSet[2] !== 0 || gameState?.Home?.PointsInSet[2] !== 0) && <td><div style={{ fontSize: getFontSizeScore(gameState?.Guest?.PointsInSet[2]) }} className="set-score">{gameState?.Guest?.PointsInSet[2]}</div></td>}
            {gameState.Sport === "Tennis" && (gameState?.Guest?.PointsInSet[3] !== 0 || gameState?.Home?.PointsInSet[3] !== 0) && <td><div style={{ fontSize: getFontSizeScore(gameState?.Guest?.PointsInSet[3]) }} className="set-score">{gameState?.Guest?.PointsInSet[3]}</div></td>}
            {gameState.Sport === "Tennis" && currentSet === 5 && <td><div style={{ fontSize: getFontSizeScore(gameState?.Guest?.Points) }} className="set-score">{gameState?.Guest?.Points}</div></td>}
          </tr>
        </table>
      </div>
    </div>
  );
}

export default Tennis;
