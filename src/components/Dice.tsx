/** @jsxImportSource @emotion/react */

import React from "react";
import { css } from '@emotion/react'

type DiceType = {
    onClick?: any
    number: number
}

function Dice({ number, onClick }: DiceType) {
    return (
        <div onClick={onClick} css={css({
            width: "4rem",
            height: "4rem",
            backgroundColor: "#474655",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        })}>
            {number}
        </div>
    )
}

export { Dice }