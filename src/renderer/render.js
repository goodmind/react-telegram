/**
 * React Telegram
 * ==============
 *
 * Exposing the renderer's API.
 */
import ReactElement from 'react/lib/ReactElement'
import ReactUpdates from 'react-dom/lib/ReactUpdates'
import ReactTelegramIDOperations from './ReactTelegramIDOperations'
import invariant from 'invariant'
import instantiateReactComponent from 'react-dom/lib/instantiateReactComponent'
import inject from './ReactTelegramInjection'
import {Screen} from '../api'

/**
 * Injecting dependencies.
 */
inject()

/**
 * Renders the given react element with Telegram Bot API.
 *
 * @param  {ReactElement}   element   - Node to update.
 * @param  {TelegramScreen}  screen    - The screen used to render the app.
 * @return {ReactComponent}           - The rendered component instance.
 */
function render (element, screen) {
  // Is the given element valid?
  invariant(
    ReactElement.isValidElement(element),
    'render(): You must pass a valid ReactElement.'
  )

  // Is the given screen valid?
  invariant(
    screen instanceof Screen,
    'render(): You must pass a valid TelegramScreen.'
  )

  // Mounting the app
  const component = instantiateReactComponent(element)

  // Injecting the screen
  ReactTelegramIDOperations.setScreen(screen)

  // The initial render is synchronous but any updates that happen during
  // rendering, in componentWillMount or componentDidMount, will be batched
  // according to the current batching strategy.
  ReactUpdates.batchedUpdates(() => {
    // Batched mount component
    const transaction = ReactUpdates.ReactReconcileTransaction.getPooled()
    transaction.perform(() => {
      component.mountComponent(transaction)
    })
    ReactUpdates.ReactReconcileTransaction.release(transaction)
  })

  // Returning the screen so the user can attach listeners etc.
  return component._instance
}

export {render}
