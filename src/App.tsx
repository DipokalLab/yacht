/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react'
import './App.css'
import { Panel } from './components/Panel';
import { ScoreBox } from './components/ScoreBox';
import { Dice } from './components/Dice';


const App: any = () => {
    const [nowTurn, setNowTurn] = useState(0)
    const [nowPlayer, setNowPlayer] = useState(0)
    const [randomDice, setRandomDice] = useState<number[]>([])
    const [playerScore, setPlayerScore] = useState<any>([])
    const [playerDice, setPlayerDice] = useState([])

    const getRandomNumber = () => {
        return 1 + Math.floor(Math.random() * 6)
    }

    const getRandomArray = (length: number) => {
        let tempNumberArray: number[] = []
        for (let index = 0; index < length; index++) {
            tempNumberArray.push(getRandomNumber())
        }
        return tempNumberArray
    }

    const initPlayerScore = () => {
        const scoreTitleArray = ["aces", "deuces", "threes", "fours", "fives", "sixes", "bonus", "choice", "fullhouse", "fourofakind", "sstraight", "lstraight", "yacht"]
        const tempScore: any = {}
        const tempDice: any = {
            pick: [0,0,0,0,0],
            round: 0
        }

        for (let index = 0; index < scoreTitleArray.length; index++) {
            tempScore[scoreTitleArray[index]] = {
                score: 0,
                enable: true
            }
        }

        setPlayerScore([...playerScore, tempScore])
        setPlayerDice([...playerDice, tempDice])
    }

    const appendNumberInPlayerDice = (num: number) => {
        const index = playerDice[nowPlayer].pick.indexOf(0)
        if (index == -1) {
            return false
        }
        playerDice[nowPlayer].pick[index] = num
        setPlayerDice([...playerDice])
    }

    const appendNumberInRandomDice = (num: number) => {
        const index = randomDice.indexOf(0)
        if (index == -1) {
            return false
        }
        randomDice[index] = num
        setRandomDice([...randomDice])
    }


    const handleClickRandomButton = () => {
        const diceLength = playerDice[nowPlayer].pick.filter((x: number) => x == 0).length
        const random = getRandomArray(diceLength)
        setRandomDice(random)
        playerDice[nowPlayer].round += 1

    }

    const handleClickScoreBox = (title: any) => {
        console.log(title)
    }

    const handleClickRandomDice = (num: number, randomDiceIndex: number) => {
        randomDice[randomDiceIndex] = 0
        appendNumberInPlayerDice(num)
    }

    const handleClickPickDice = (index: number) => {
        const thisDiceNumber = playerDice[nowPlayer].pick[index]
        playerDice[nowPlayer].pick[index] = 0

        setPlayerDice([...playerDice])
        appendNumberInRandomDice(thisDiceNumber)
    }

    useEffect(() => {
        console.log(playerScore)

    }, [playerScore])

    useEffect(() => {
        initPlayerScore()
        console.log(getRandomArray(5))
    }, [])
    
    return (
        <div>
            <Panel>
                <div css={css({
                    display: "flex",
                    flexDirection: "column"
                })}>

                    <p>pick:</p>
                    <div css={css({
                        display: "flex",
                        flexDirection: "row"
                    })}>
                        {playerDice.map((diceNumber: any) => (
                            <>
                                <p>{diceNumber.round} / 3</p>
                                
                                {diceNumber.pick.map((dice: any, index: number) => (
                                    <>
                                        <Dice number={dice} onClick={() => handleClickPickDice(index)}></Dice>

                                    </>
                                ))}

                            </>
                        ))}
                    </div>

                    
                    <p>random:</p>

                    <div css={css({
                        display: "flex",
                        flexDirection: "row"
                    })}>
                        {randomDice.map((item: any, index: number) => (
                            <Dice number={item} onClick={() => handleClickRandomDice(item, index)}></Dice>
                        ))}
                    </div>


                    <button onClick={handleClickRandomButton}>주사위 굴리기</button>

                    <div css={css({
                        display: "flex",
                        flexDirection: "column"
                    })}>
                        {playerScore.map((el: any, index: any) => (
                            <div css={css({
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem"
                            })}>
                                {Object.keys(el).map(key => ({
                                    key: key,
                                    ...el[key]
                                })).map(score => (
                                    <ScoreBox number={score.score} onClick={() => handleClickScoreBox(score.key)}></ScoreBox>
                                ))}
                            </div>
                        ))}

                    </div>
                </div>

            </Panel>

        </div>
    );
};

export default App;