import React from 'react'

const PlayerContext = React.createContext()

export const PlayerProvider = PlayerContext.Provider
export const PlayerConsumer = PlayerContext.Consumer

export default PlayerContext