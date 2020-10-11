import React, { useContext, useState, useEffect } from 'react'
import './CardsPage.css'
import { Context } from './context'
import { Link } from 'react-router-dom'
import Card from './Card'

import cardsJson from './cards.json' // JSON extracted from the MtG API for faster use

// Constant values that are frozen so that they can't be mutated in any way
const ALL_CARD_TYPES = ['Artifact', 'Autobot', 'Card', 'Character', 'Conspiracy', 'Creature', 'Dragon', 'Elemental',
    'Enchantment', 'Goblin', 'Hero', 'Instant', 'Jaguar', 'Knights', 'Land', 'Phenomenon', 'Plane', 'Planeswalker',
    'Scheme', 'Sorcery', 'Specter', 'Summon', 'Tribal', 'Vanguard', 'Wolf', 'You’ll']
Object.freeze(ALL_CARD_TYPES)
const ALL_CARD_COLORS = ['White', 'Blue', 'Black', 'Red', 'Green']
Object.freeze(ALL_CARD_COLORS)

const CardsPage = props => {
    // The global state
    const { name, setName, cards, setCards } = useContext(Context)

    const [loaded, setLoaded] = useState(false) // Card load state
    const [filteredCards, setFilteredCards] = useState([]) // Filtered cards

    const [searchTerm, setSearchTerm] = useState('') // Search term to filter cards by
    const [cardTypeSelectedValues, setCardTypeSelectedValues] = useState([]) // Card type value
    const [cardColorSelectedValues, setCardColorSelectedValues] = useState([]) // Card color value
    const [cardOrder, setCardOrder] = useState('Sort')

    const handleSearchTerm = event => {
        setSearchTerm(event.target.value)
    }

    const handleTypeChange = event => {
        const selected = []
        let selectedOption = (event.target.selectedOptions)
        for (let i = 0; i < selectedOption.length; i++) {
            selected.push(selectedOption.item(i).value)
        }
        setCardTypeSelectedValues(selected)
    }

    const handleColorChange = event => {
        const selected = []
        let selectedOption = (event.target.selectedOptions)
        for (let i = 0; i < selectedOption.length; i++) {
            selected.push(selectedOption.item(i).value)
        }
        setCardColorSelectedValues(selected)
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
    // useEffect(() => {
    //     const getCards = () => {
    //         // GET Request.
    //         fetch('https://api.magicthegathering.io/v1/cards?random=true&pageSize=100&language=English/')
    //             // Handle success
    //             // Convert to json
    //             .then(response => response.json())
    //             .then(data => {

    //                 setCards(data.cards) // Set global state cards
    //                 setFilteredCards(data.cards) // Set filtered cards that will be displayed
    //                 setLoaded(true) // Cards are loaded
    //             })
    //             // Catch errors
    //             .catch(error => console.log('Request Failed with error: ', error))
    //     }
    //     getCards()
    // }, [setCards])

    // If the name was reset, usually because of a page reload, read it from localStorage
    useEffect(() =>{
		const localName = localStorage.getItem('name')
		if(localName !== null){
			setName(localName)
		}
    },[setName])

    // Load cards dummy effect with local Json for faster loading
    useEffect(() => {
        setCards(cardsJson.cards)
        setFilteredCards(cardsJson.cards)
        setLoaded(true)
    }, [setCards])

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
                        if (card.types[i].toLowerCase().includes(cardTypeSelectedValues[j].toLowerCase())) {
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
                        if (card.colors[i].toLowerCase().includes(cardColorSelectedValues[j].toLowerCase())) {
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
                    <select className='CardsPage-card-color-selector' id='CardsPage-card-color-selector' multiple={true} value={cardColorSelectedValues} onChange={handleColorChange}>
                        {ALL_CARD_COLORS.map(item => <option className='CardsPage-card-color-option' key={item} value={item}>{item}</option>)}
                    </select>

                    <label htmlFor='CardsPage-card-type-selector'>Filter cards by <strong>type</strong></label>
                    <select className='CardsPage-card-type-selector' id='CardsPage-card-type-selector' multiple={true} value={cardTypeSelectedValues} onChange={handleTypeChange}>
                        {ALL_CARD_TYPES.map(item => <option className='CardsPage-card-type-option' key={item} value={item}>{item}</option>)}
                    </select>
                </div>

                <div className='CardsPage-controls-right-or-bottom-panel'>
                    <label htmlFor='CardsPage-search-term-filter'>Filter cards by name or text</label>
                    <input type='text' className='CardsPage-search-term-filter' name='CardsPage-search-term-filter' id='CardsPage-search-term-filter' value={searchTerm} onChange={handleSearchTerm} />

                    <label htmlFor='CardsPage-alphabetic-sorting-selector'>Sort card alphabetically</label>
                    <select className='CardsPage-alphabetic-sorting-selector' name='CardsPage-alphabetic-sorting-selector' id='CardsPage-alphabetic-sorting-selector' value={cardOrder} onChange={handleSortingOrder}>
                        <option className='CardsPage-sorting-option' value='Sort' disabled defaultValue>Sort</option>
                        <option className='CardsPage-sorting-option' value='Ascending'>Ascending</option>
                        <option className='CardsPage-sorting-option' value='Descending'>Descending</option>
                    </select>

                    <div className='CardsPage-number-of-cards-found'>Cards found: <strong>{filteredCards.length}</strong></div>

                    <Link className='CardsPage-back-button' to='/'>Home</Link>
                </div>
            </div>
            <div className='CardPage-explanation'><em>Please hold the CTRL button when clicking to deselect or to select multiple options</em></div>

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
                    : 'Loading cards ...'}
            </div>
        </div>
    )
}

export default CardsPage
