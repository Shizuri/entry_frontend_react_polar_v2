import React from 'react'
import { Route, Switch } from 'react-router-dom'

import './App.css'
import HomePage from './HomePage'
import CardsPage from './CardsPage'
import NotFound from './NotFound'

const App = () => {
    return (
        <div className='App'>
            <Switch >
                <Route exact path='/'>
                    <HomePage />
                </Route>
                <Route exact path='/cards-page'>
                    <CardsPage />
                </Route>
                <Route>
                    <NotFound />
                </Route>
            </Switch>
        </div>
    )
}

export default App
