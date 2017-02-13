/**
 * React Telegram Dependency Injection
 * ===================================
 *
 * Injecting the renderer's needed dependencies into React's internals.
 */
import ReactInjection from 'react-dom/lib/ReactInjection'
import ReactComponentEnvironment from 'react-dom/lib/ReactComponentEnvironment'
import ReactTelegramReconcileTransaction from './ReactTelegramReconcileTransaction'
import ReactTelegramComponent from './ReactTelegramComponent'
import ReactTelegramEmptyComponent from './ReactTelegramEmptyComponent'
import ReactDefaultBatchingStrategy from 'react-dom/lib/ReactDefaultBatchingStrategy'

export default function inject () {
  ReactInjection.HostComponent.injectGenericComponentClass(
    ReactTelegramComponent
  )

  ReactInjection.EmptyComponent.injectEmptyComponentFactory(instantiate => {
    return new ReactTelegramEmptyComponent(instantiate)
  })

  ReactInjection.Updates.injectReconcileTransaction(
    ReactTelegramReconcileTransaction
  )

  ReactInjection.Updates.injectBatchingStrategy(
    ReactDefaultBatchingStrategy
  )

  ReactComponentEnvironment.injection.injectEnvironment({
    processChildrenUpdates: function () {},
    replaceNodeWithMarkup: function () {}
  })
}
