/**
 * React Telegram Specific React Transaction
 * =========================================
 *
 * React custom reconcile transaction injected by the renderer to enable
 * updates.
 *
 * NOTE: This looks more like a shim than the proper thing actually.
 */
import CallbackQueue from 'react-dom/lib/CallbackQueue'
import PooledClass from 'react-dom/lib/PooledClass'
import Transaction from 'react-dom/lib/Transaction'
import ReactUpdateQueue from 'react-dom/lib/ReactUpdateQueue'
import {extend} from 'lodash'

const ON_TELEGRAM_READY_QUEUEING = {
  initialize: function () {
    this.reactMountReady.reset()
  },
  close: function () {
    this.reactMountReady.notifyAll()
  }
}

function ReactTelegramReconcileTransaction () {
  this.reinitializeTransaction()
  this.reactMountReady = CallbackQueue.getPooled(null)
}

const Mixin = {
  getTransactionWrappers: function () {
    return [ON_TELEGRAM_READY_QUEUEING]
  },
  getReactMountReady: function () {
    return this.reactMountReady
  },
  getUpdateQueue: function () {
    return ReactUpdateQueue
  },
  destructor: function () {
    CallbackQueue.release(this.reactMountReady)
    this.reactMountReady = null
  }
}

extend(
  ReactTelegramReconcileTransaction.prototype,
  Transaction,
  Mixin
)

PooledClass.addPoolingTo(ReactTelegramReconcileTransaction)

export default ReactTelegramReconcileTransaction
