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
    const [playerTotalScore, setPlayerTotalScore] = useState([])

    const [playerDice, setPlayerDice] = useState([])
    const [scoreTitleArray, setScoreTitleArray] = useState(["aces", "deuces", "threes", "fours", "fives", "sixes", "bonus", "choice", "fullhouse", "fourofakind", "sstraight", "lstraight", "yacht"])

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
        setPlayerTotalScore([...playerTotalScore, 0])
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

    const appendScore = (score: number, key: string) => {
        if (playerScore[nowPlayer][key].enable == false) {
            return false
        }

        playerScore[nowPlayer][key].score = score
    }

    const getTopCategoriesScore = (num: number) => {
        const pickDices = playerDice[nowPlayer].pick
        const score = pickDices.filter((x: number) => x == num).length * num
        return score
    }

    const resetRandomDice = () => {
        playerDice[nowPlayer].pick = [0,0,0,0,0]
        setRandomDice([])
    }

    const calculateScore = () => {
        const pickDices = playerDice[nowPlayer].pick
        // const categories = ["aces", "deuces", "threes", "fours", "fives", "sixes", "bonus", "choice", "fourofakind", "fullhouse", "sstraight", "lstraight", "yacht"]
        // ["aces", "deuces", "threes", "fours", "fives", "sixes", "bonus", "choice", "fullhouse", "fourofakind", "sstraight", "lstraight", "yacht"]

        const calculate: any = {
            "aces": (title: string) => {
                const score = getTopCategoriesScore(1)
                appendScore(score, title)
            },
            "deuces": (title: string) => {
                const score = getTopCategoriesScore(2)
                appendScore(score, title)
            },           
            "threes": (title: string) => {
                const score = getTopCategoriesScore(3)
                appendScore(score, title)
            },            
            "fours": (title: string) => {
                const score = getTopCategoriesScore(4)
                appendScore(score, title)
            },            
            "fives": (title: string) => {
                const score = getTopCategoriesScore(5)
                appendScore(score, title)
            },           
            "sixes": (title: string) => {
                const score = getTopCategoriesScore(6)
                appendScore(score, title)
            },
            "bonus": (title: string) => {
                const score = 0
                appendScore(score, title)
            },
            "choice": (title: string) => {
                const score = pickDices.reduce((x: number, y: number) => {
                    return x + y
                }, 0)

                appendScore(score, title)
            },
            "fourofakind": (title: string) => {
                let score = 0
                for (let index = 0; index < pickDices.length; index++) {
                    const count = pickDices.filter((x: number) => x == pickDices[index]).length
                    if (count >= 4) {
                        score = pickDices.reduce((x: number, y: number) => {
                            return x + y
                        }, 0)
                        appendScore(score, title)
                        return true
                    }
                }

                appendScore(score, title)
            },
            "fullhouse": (title: string) => {
                let score = 0
                for (let index = 0; index < pickDices.length; index++) {
                    const count = pickDices.filter((x: number) => x == pickDices[index]).length
                    if (count == 3) {

                        for (let indexLast = 0; indexLast < pickDices.length; indexLast++) {
                            const count = pickDices.filter((x: number) => x == pickDices[indexLast]).length
                            if (count == 2) {
                                score = pickDices.reduce((x: number, y: number) => {
                                    return x + y
                                }, 0)
                                appendScore(score, title)
                                return true
                            }
                        }

                    }
                }

                appendScore(score, title)
            },

            "sstraight": (title: string) => {
                const sortDices = pickDices.sort()
                let startPoint = 0
                let streak = 0

                for (let index = 0; index < sortDices.length; index++) {
                    if (sortDices[index] != 0) {
                        if (startPoint + 1 == sortDices[index]) {
                            startPoint += 1
                            streak += 1
                            if (streak >= 4) {
                                break
                            }
                        } else {
                            startPoint = sortDices[index]
                            streak = 1
                        }
                    }
                }

                appendScore(streak >= 4 ? 15 : 0, title)
            },
            
            "lstraight": (title: string) => {
                const sortDices = pickDices.sort()
                let startPoint = 0
                let streak = 0

                for (let index = 0; index < sortDices.length; index++) {
                    if (sortDices[index] != 0) {
                        if (startPoint + 1 == sortDices[index]) {
                            startPoint += 1
                            streak += 1
                            if (streak == 5) {
                                break
                            }
                        } else {
                            startPoint = sortDices[index]
                            streak = 1
                        }
                    }
                }

                appendScore(streak == 5 ? 30 : 0, title)
            },

            "yacht": (title: string) => {
                let isYacht = true
                for (let index = 0; index < pickDices.length; index++) {
                    if (pickDices[index] == 0) {
                        isYacht = false
                    }
                    if (pickDices[index] != 0) {
                        if (pickDices[0] != pickDices[index]) {
                            isYacht = false
                        }

                    }
                }
                const score = isYacht ? 50 : 0
                appendScore(score, title)
            },
        }

        for (let index = 0; index < scoreTitleArray.length; index++) {
            const title = scoreTitleArray[index]
            calculate[title](title)

        }
    }


    const calculateTotalScore = () => {
        for (let index = 0; index < playerScore.length; index++) {
            let count = 0
            console.log(playerScore[index])

            for (const key in playerScore[index]) {
                if (Object.prototype.hasOwnProperty.call(playerScore[index], key)) {
                    if (playerScore[index][key].enable == false) {
                        count += playerScore[index][key].score
                    }                    
                }
            }

            playerTotalScore[index] = count
        }
        
        console.log("playerTotalScore", playerTotalScore)
        setPlayerTotalScore([...playerTotalScore])
    }



    const handleClickRandomButton = () => {
        if (playerDice[nowPlayer].round >= 3) {
            return false
        }

        const diceLength = playerDice[nowPlayer].pick.filter((x: number) => x == 0).length
        const random = getRandomArray(diceLength)
        setRandomDice(random)
        playerDice[nowPlayer].round += 1

    }

    const handleClickScoreBox = (score: number, key: any) => {
        if (playerScore[nowPlayer][key].enable == false) {
            return false
        }

        playerScore[nowPlayer][key].score = score
        playerScore[nowPlayer][key].enable = false
        playerDice[nowPlayer].round = 0
        resetRandomDice()
        calculateScore()
        calculateTotalScore()
    }

    const handleClickRandomDice = (num: number, randomDiceIndex: number) => {
        randomDice[randomDiceIndex] = 0
        appendNumberInPlayerDice(num)
        calculateScore()
    }

    const handleClickPickDice = (index: number) => {
        const thisDiceNumber = playerDice[nowPlayer].pick[index]
        playerDice[nowPlayer].pick[index] = 0

        setPlayerDice([...playerDice])
        appendNumberInRandomDice(thisDiceNumber)
        calculateScore()
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
                        flexDirection: "row"
                    })}>

                        <div css={css({
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem"
                        })}>
                            {scoreTitleArray.map((item: string) => (
                                <p css={css({ margin: '0.42rem', textAlign: "end" })}>{item}</p>
                            ))}
                        </div>
                        {playerScore.map((el: any, index: any) => (
                            <div css={css({
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.5rem"
                            })}>
                                {Object.keys(el).map(key => ({
                                    key: key,
                                    ...el[key]
                                })).map(score => (
                                    <ScoreBox number={score.score} onClick={() => handleClickScoreBox(score.score, score.key)}></ScoreBox>
                                ))}

                                <p>{playerTotalScore[index]}</p>

                            </div>
                        ))}

                    </div>
                </div>

            </Panel>

        </div>
    );
};

export default App;