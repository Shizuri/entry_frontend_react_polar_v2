import React, { useContext, useState, useEffect } from 'react'
import './CardsPage.css'
import './loadingAnimation.css'
import { Context } from './context'
import { Link } from 'react-router-dom'
import Card from './Card'

import MultiSelect from 'react-multi-select-component'

// JSON extracted from the MtG API for faster testing
// Comment it in with it's useEffect call
// import cardsJson from './cards.json'

// Constant values that are frozen so that they can't be mutated in any way
const ALL_CARD_TYPES_OBJECTS = [
    { label: 'Artifact', value: 'Artifact' },
    { label: 'Autobot', value: 'Autobot' },
    { label: 'Card', value: 'Card' },
    { label: 'Character', value: 'Character' },
    { label: 'Conspiracy', value: 'Conspiracy' },
    { label: 'Creature', value: 'Creature' },
    { label: 'Dragon', value: 'Dragon' },
    { label: 'Elemental', value: 'Elemental' },
    { label: 'Enchantment', value: 'Enchantment' },
    { label: 'Goblin', value: 'Goblin' },
    { label: 'Hero', value: 'Hero' },
    { label: 'Instant', value: 'Instant' },
    { label: 'Jaguar', value: 'Jaguar' },
    { label: 'Knights', value: 'Knights' },
    { label: 'Land', value: 'Land' },
    { label: 'Phenomenon', value: 'Phenomenon' },
    { label: 'Plane', value: 'Plane' },
    { label: 'Planeswalker', value: 'Planeswalker' },
    { label: 'Scheme', value: 'Scheme' },
    { label: 'Sorcery', value: 'Sorcery' },
    { label: 'Specter', value: 'Specter' },
    { label: 'Summon', value: 'Summon' },
    { label: 'Tribal', value: 'Tribal' },
    { label: 'Vanguard', value: 'Vanguard' },
    { label: 'Wolf', value: 'Wolf' },
    { label: 'You’ll', value: 'You’ll' }
]
Object.freeze(ALL_CARD_TYPES_OBJECTS)
const ALL_CARD_COLORS_OBJECTS = [
    { label: 'White', value: 'White' },
    { label: 'Blue', value: 'Blue' },
    { label: 'Black', value: 'Black' },
    { label: 'Red', value: 'Red' },
    { label: 'Green', value: 'Green' }
]
Object.freeze(ALL_CARD_COLORS_OBJECTS)

const CardsPage = props => {
    // The global state
    const { name, setName, cards, setCards } = useContext(Context)

    const [loaded, setLoaded] = useState(false) // Card load state
    const [filteredCards, setFilteredCards] = useState([]) // Filtered cards

    const [searchTerm, setSearchTerm] = useState('') // Search term to filter cards by
    const [cardColorSelectedValues, setCardColorSelectedValues] = useState([]) // Card color value
    const [cardTypeSelectedValues, setCardTypeSelectedValues] = useState([]) // Card type value
    const [cardOrder, setCardOrder] = useState('Sort')

    const handleSearchTerm = event => {
        setSearchTerm(event.target.value)
    }

    const handleSortingOrder = event => {
        const { value } = event.target
        switch (value) {
            case 'Ascending':
                cards.sort((a, b) => a.name.localeCompare(b.name))
                break
            case 'Descending':
                cards.sort((a, b) => b.name.localeCompare(a.name))
                break
            default:
                break
        }
        setCardOrder(value)
    }

    // Load cards
    useEffect(() => {
        let isMounted = true

        const getCards = () => {
            // GET Request.
            fetch('https://api.magicthegathering.io/v1/cards?random=true&pageSize=100&language=English/')
                // Handle success
                // Convert to json
                .then(response => {
                    if (isMounted) {
                        return response.json()
                    }
                })
                .then(data => {
                    if (isMounted) {
                        setCards(data.cards) // Set global state cards
                        setFilteredCards(data.cards) // Set filtered cards that will be displayed
                        setLoaded(true) // Cards are loaded
                    }
                })
                // Catch errors
                .catch(error => {
                    if (isMounted) {
                        console.log('Request Failed with error: ', error)
                    }
                })

        }

        getCards()
        // Set isMounted to false so that the fetch request does not happen
        // This prevents a memory leak scenario on a fast component unmount
        return () => { isMounted = false }
    }, [setCards])

    // Load cards dummy effect with local JSON
    // Comment the previous useEffect and comment this out for faster testing
    // useEffect(() => {
    //     setCards(cardsJson.cards)
    //     setFilteredCards(cardsJson.cards)
    //     setLoaded(true)
    // }, [setCards])

    // If the name was reset, usually because of a page reload, read it from localStorage
    useEffect(() => {
        const localName = localStorage.getItem('name')
        if (localName !== null) {
            setName(localName)
        }
    }, [setName])

    useEffect(() => {
        // Update the document title
        document.title = 'MtG Cards Browser'
    }, [])

    // Update cards on filter change
    useEffect(() => {
        let result = cards // Start with all the cards

        // Filter by search term
        const nameTextFilterResult = cards.filter(card => {
            // Sometimes there is no entry for text, check for it
            if (card.name && card.text) {
                return (
                    card.name.toLowerCase().includes(searchTerm.toLowerCase())
                    || card.text.toLowerCase().includes(searchTerm.toLowerCase())
                )
            } else {
                // If there is no entry for text, filter just by name
                return (card.name.toLowerCase().includes(searchTerm.toLowerCase()))
            }
        })
        // Update the result to be the new filtered by term results
        result = nameTextFilterResult

        // Filter by card type
        const cardTypeSelectedValuesFilterResult = result.filter(card => {
            // Check if the card has a type provided by the API
            if (card.types) {
                for (let i = 0; i < card.types.length; i++) {
                    for (let j = 0; j < cardTypeSelectedValues.length; j++) {
                        // If any member of the card types array is found in the array of selected types, filter it in
                        // This will make sure that if the card has more than one type it will still be shown
                        if (card.types[i].toLowerCase().includes(cardTypeSelectedValues[j].value.toLowerCase())) {
                            return true
                        }
                    }
                }
            }
            return false
        })
        // If no values of the card type MultiSelect menu were selected, show all previously filtered results
        if (cardTypeSelectedValues.length > 0) {
            result = cardTypeSelectedValuesFilterResult
        }

        // Filter by card color
        const cardColorSelectedValuesFilterResult = result.filter(card => {
            // Check if the card has a color provided by the API
            if (card.colors) {
                for (let i = 0; i < card.colors.length; i++) {
                    for (let j = 0; j < cardColorSelectedValues.length; j++) {
                        if (card.colors[i].toLowerCase().includes(cardColorSelectedValues[j].value.toLowerCase())) {
                            // If any member of the card types array is found in the array of selected types, filter it in
                            // This will make sure that if the card has more than one type it will still be shown
                            return true
                        }
                    }
                }
            }
            return false
        })
        if (cardColorSelectedValues.length > 0) {
            result = cardColorSelectedValuesFilterResult
        }

        setFilteredCards(result)
    }, [cards, searchTerm, cardTypeSelectedValues, cardColorSelectedValues, cardOrder])

    return (
        <div className='CardsPage'>
            <h1 className='CardsPage-greeting'>Hello, {name}</h1>

            <div className='CardsPage-controls'>
                <div className='CardsPage-controls-left-or-top-panel'>
                    <label htmlFor='CardsPage-card-color-selector'>Filter cards by <strong>color</strong></label>
                    <MultiSelect
                        className='CardsPage-card-color-selector'
                        options={ALL_CARD_COLORS_OBJECTS}
                        value={cardColorSelectedValues}
                        onChange={setCardColorSelectedValues}
                        // shouldToggleOnHover={true}
                        focusSearchOnOpen={false}
                    />

                    <label htmlFor='CardsPage-card-type-selector'>Filter cards by <strong>type</strong></label>
                    <MultiSelect
                        className='CardsPage-card-type-selector'
                        options={ALL_CARD_TYPES_OBJECTS}
                        value={cardTypeSelectedValues}
                        onChange={setCardTypeSelectedValues}
                        // shouldToggleOnHover={true}
                        focusSearchOnOpen={false}
                    />

                </div>

                <div className='CardsPage-controls-right-or-bottom-panel'>
                    <label htmlFor='CardsPage-search-term-filter'>Filter cards by <strong>name</strong> or <strong>text</strong></label>
                    <input type='text' className='CardsPage-search-term-filter' name='CardsPage-search-term-filter' id='CardsPage-search-term-filter' value={searchTerm} onChange={handleSearchTerm} />

                    <label htmlFor='CardsPage-alphabetic-sorting-selector'>Sort card <strong>alphabetically</strong></label>
                    <select className='CardsPage-alphabetic-sorting-selector' name='CardsPage-alphabetic-sorting-selector' id='CardsPage-alphabetic-sorting-selector' value={cardOrder} onChange={handleSortingOrder}>
                        <option className='CardsPage-sorting-option' value='Sort' disabled defaultValue>Sort</option>
                        <option className='CardsPage-sorting-option' value='Ascending'>Ascending</option>
                        <option className='CardsPage-sorting-option' value='Descending'>Descending</option>
                    </select>

                </div>
            </div>

            <div className='CardsPage-info-panel'>
                <div className='CardsPage-number-of-cards-found'>Cards found: <strong>{filteredCards.length}</strong></div>
                <div className='CardsPage-button-container'><Link className='CardsPage-back-button' to='/'>Home</Link></div>
            </div>

            <div className='CardsPage-cards'>
                {loaded ? filteredCards.map(card =>
                    <Card
                        key={card.id}
                        name={card.name}
                        text={card.text}
                        types={card.types}
                        setName={card.setName}
                        colors={card.colors}
                        imageUrl={card.imageUrl}
                    />)
                    :
                    // Loading animation
                    <div className='loadingio-spinner-spinner-ssc7g0lctwf'><div className='ldio-9mbi9huikr'>
                        <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
                    </div></div>
                }
            </div>
        </div>
    )
}

export default CardsPage