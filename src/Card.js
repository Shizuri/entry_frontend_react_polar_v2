import React from 'react'
import './Card.css'
import useFormatArrayOutput from './hooks/useFormatArrayOutput'
import MtGCardBackImage from './images/MtGCardBack.jpg'

const Card = props => {
    return (
        <div className='Card'>
            <div className='Card-image-panel'>
                {props.imageUrl ?
                    <img className='Card-image' src={props.imageUrl} alt={props.name} /> :
                    <img className='Card-image' src={MtGCardBackImage} alt={props.name} />
                }
                {props.imageUrl ? null :
                    <div className='Card-image-not-found'>Image not found</div>
                }

            </div>
            <div className='Card-data-panel'>
                <div><strong>Name:</strong> {props.name}</div>
                <div><strong>{props.types ? props.types.length > 1 ? 'Types: ' : 'Type: ' : 'Type: '}</strong> {useFormatArrayOutput(props.types)}</div>
                <div><strong>Set name:</strong> {props.setName}</div>
                <div><strong>{props.colors.length !== 0 ? props.colors.length > 1 ? 'Colors: ' : 'Color: ' : 'Card is colorless '}</strong> {useFormatArrayOutput(props.colors)}</div>
                <div><strong>Text:</strong> {props.text}</div>
            </div>
        </div>
    )
}

export default Card
