import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { routerMiddleware, routerReducer } from 'react-router-redux'

const rootReducer = combineReducers({
  routing: routerReducer
})

export default function configureStore (history) {
  let middlewares = [
    routerMiddleware(history)
  ]

  const store = createStore(rootReducer, {}, compose(
    applyMiddleware(...middlewares)
  ))

  return store
}
