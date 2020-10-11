// This component provides global state management for the app
import React, { useState } from 'react'
const Context = React.createContext()

const ContextProvider = props => {
    const [name, setName] = useState('') // User name
    const [cards, setCards] = useState([]) // Fetched cards

    return (
        <Context.Provider value={{
            name,
            setName,
            cards,
            setCards
        }}>
            {props.children}
        </Context.Provider>
    )
}

export { ContextProvider, Context }