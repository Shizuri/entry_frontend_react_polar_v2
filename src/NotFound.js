import React, { useEffect } from 'react'
import './NotFound.css'

const NotFound = () => {
    useEffect(() => {
        // Update the document title
        document.title = 'Page not found'
    }, [])

    return (
        <div className='NotFound'>
            <h1>Error 404, page not found</h1>
        </div>
    )
}

export default NotFound
