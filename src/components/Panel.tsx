/** @jsxImportSource @emotion/react */

import React from "react";
import { css } from '@emotion/react'

type PanelType = {
    children?: any
}

function Panel({ children }: PanelType) {
    return (
        <div css={css({
            display: "flex",
            position: "absolute",
            overflow: "scroll",
            top: "0",
            left: "0",
            width: "30vw",
            height: "100%",
            backgroundColor: "#17171A"
        })}>
            {children}
        </div>
    )
}

export { Panel }