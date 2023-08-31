import { useEffect, useState } from "react"

import { BigPlayButton, ControlBar, LoadingSpinner, Player, PlayToggle } from "video-react"
import { Box } from "@mantine/core"

export const VideoPlayer = ({ src, onPlayerChange, onChange, startTime = undefined }) => {
    const [player, setPlayer] = useState(undefined)
    const [playerState, setPlayerState] = useState(undefined)

    useEffect(() => {
        if (playerState) {
            onChange(playerState)
        }
    }, [playerState])

    useEffect(() => {
        onPlayerChange(player)

        if (player) {
            player.subscribeToStateChange(setPlayerState)
        }
    }, [player])

    return (
        <Box className="Filled">
            <Player
                ref={(player) => {
                    setPlayer(player)
                }}
                startTime={startTime}
            >
                <source src={src} />
                <BigPlayButton position="center" />
                <LoadingSpinner />
                <ControlBar disableCompletely={true}>
                    <PlayToggle />
                </ControlBar>
            </Player>
        </Box>
    )
}
