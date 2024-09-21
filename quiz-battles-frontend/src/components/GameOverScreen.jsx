import { useGameContext } from "../contexts/GameContext";
import { useEffect } from "react";
import { emojiBlast } from "emoji-blast";

const GameOverScreen = () => {
    const { gameState } = useGameContext();

    useEffect(() => {
        emojiBlast({
            emojis: ["🥳", "🎉", "😍", "👌", "😎", "❤️", "💥", "🎊", "🧨", "🔥", "💯"],
            position: {
                x: innerWidth / 2,
                y: innerHeight / 2
            },
            emojiCount: 50,
            physics: {
                fontSize: { max: 80, min: 32 },
                gravity: 0.125,
                initialVelocities: {
                    x: { max: 25, min: -25 },
                    y: { max: 10, min: -35 }
                },
                rotation: { max: 25, min: -25 },
            }
        })
    }, []);

    return (
        <div className="flex items-stretch flex-wrap justify-center flex-row gap-4">
            <h2 className="mb-4 text-4xl self-center">Scoreboard</h2>
              {Object.entries(gameState.finalScore).map(([index, scoreObject]) => (
                <div key={index} className={`card bg-base-100 shadow-xl items-center text-center flex-grow basis-full p-4 gap-4 ${index == 0 && "text-primary"}`}>
                    <h3 className="text-3xl font-semibold self-center btn-disabled">{scoreObject.username}</h3>
                    {typeof scoreObject?.score === "number" && (<p className="text-lg self-center font-medium btn-disabled">Score: {scoreObject.score}</p>)}
                    {typeof scoreObject?.money === "number" && gameState.gameState.options.battle.enabled && (<p className="text-lg self-center font-medium btn-disabled">Money: {scoreObject.money}$</p>)}
                </div>
              ))}
        </div>
    )
}

export default GameOverScreen
