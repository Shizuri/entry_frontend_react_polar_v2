import React, { useContext, useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import './HomePage.css'
import './normalize.css'

import { Context } from './context'

const HomePage = props => {
	// The global state of name
	const { name, setName } = useContext(Context)

	// React router hook needed here for redirecting to the cards page
	const history = useHistory()

	// Dynamically updating the name value
	const handleChange = event => {
		setName(event.target.value)
	}

	// For all intents and purposes React's version of "document.getElementById()"
	const userNameRef = useRef(null)

	const handleSubmit = event => {
		// This is a Single Page Application so this prevents the browser from reloading the app
		event.preventDefault()
		// Set name to localStorage
		localStorage.setItem('name', name)
		// Redirecting to the Cards Page
		history.push('/cards-page')
	}

	// React "forgets" its reference so it recommends that you put it in a constant
	const currentUserNameRef = userNameRef.current

	useEffect(() => {
		// Custom validation for a better user experience
		if (userNameRef && currentUserNameRef) {
			const handleUppercaseValidation = () => {
				if (currentUserNameRef.validity.patternMismatch) {
					currentUserNameRef.setCustomValidity('The first character should be an Uppercase Letter')
				} else {
					currentUserNameRef.setCustomValidity('')
				}
			}
			// The event listener MUST be named "input" for this to work
			currentUserNameRef.addEventListener('input', handleUppercaseValidation)
			return () => {
				currentUserNameRef.removeEventListener('input', handleUppercaseValidation)
			}
		}
		// Update the use effect only if currentUserNameRef changes and not on every refresh
	}, [currentUserNameRef])

	return (
		<div className='HomePage'>
			<form className='HomePage-form' onSubmit={handleSubmit}>
				<label className='HomePage-name-label' htmlFor='name'>Name:</label>
				<input className='HomePage-name-input' type='text' id='HomePage-name-input' name='name' value={name}
					onChange={handleChange} placeholder='Your name here' ref={userNameRef} required minLength='3' pattern='^[A-Z].*' />
				<input className='HomePage-submit-button' type='submit' value='Submit' />
			</form>
		</div>
	)
}

export default HomePage
