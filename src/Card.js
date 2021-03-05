import React from 'react'
import './Card.css'
import useFormatArrayOutput from './hooks/useFormatArrayOutput'
import MtGCardBackImage from './images/MtGCardBack.jpg'

const Card = props => {
    const formatArrayOutput = arr => {
        if (!arr) {
            return <span>-- no data --</span>
        } else if (arr.length === 1) {
            return <span>{arr[0]}</span>
        } else {
            return (
                <span>
                {arr.map((item, i) => <span key={item}>
                <span>{item}{i + 1 === arr.length ? ' ' : ','} </span>
            </span>)}
            </span>
            )
        }
    }

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
                {props.colors
                    ? <div>
                    <strong>{props.colors.length !== 0 ? props.colors.length > 1 ? 'Colors: ' : 'Color: ' : 'Card is colorless '}</strong> {formatArrayOutput(props.colors)}
                    </div>
                : <strong><div>Card is colorless</div></strong>}
                <div><strong>Text:</strong> {props.text}</div>
            </div>
        </div>
    )
}

export default Card
