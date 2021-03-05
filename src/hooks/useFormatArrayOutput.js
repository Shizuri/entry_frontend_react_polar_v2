// IMPORTANT This component was removed after the API rework. Since hooks can't be used conditionally it was transformed into a function inside Card.js
import React from 'react'

const useFormatArrayOutput = arr => {
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

export default useFormatArrayOutput
