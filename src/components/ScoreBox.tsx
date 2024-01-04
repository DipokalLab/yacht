/** @jsxImportSource @emotion/react */

import React from "react";
import { css } from '@emotion/react'

type ScoreBoxType = {
    onClick?: any
    number: number
}

function ScoreBox({ number, onClick }: ScoreBoxType) {
    return (
        <div onClick={onClick} css={css({
            minWidth: "3rem",
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

export { ScoreBox }