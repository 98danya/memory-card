const Scoreboard = ({ score, bestScore }) => {
    return (
      <div>
        <h2>Score: {score}</h2>
        <h2>Best Score: {bestScore}</h2>
      </div>
    );
  };
  
  export default Scoreboard;