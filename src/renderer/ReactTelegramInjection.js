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

  ReactInjection.Updates.injectReconcileTransaction(
    ReactTelegramReconcileTransaction
  )

  ReactInjection.Updates.injectBatchingStrategy(
    ReactDefaultBatchingStrategy
  )

  ReactInjection.EmptyComponent.injectEmptyComponentFactory(instantiate => {
    return new ReactTelegramEmptyComponent(instantiate)
  })

  // NOTE: we're monkeypatching ReactComponentEnvironment because
  // ReactInjection.Component.injectEnvironment() currently throws,
  // as it's already injected by ReactDOM for backward compat in 0.14 betas.
  ReactComponentEnvironment.processChildrenUpdates = function () {}
  ReactComponentEnvironment.replaceNodeWithMarkupByID = function () {}
}
