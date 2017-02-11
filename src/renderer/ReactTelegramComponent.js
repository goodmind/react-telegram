/**
 * React Telegram Component
 * ========================
 *
 * React component abstraction for the Telegram Bot API.
 */
import * as telegram from '../api'
import ReactMultiChild from 'react-dom/lib/ReactMultiChild'
import ReactTelegramIDOperations from './ReactTelegramIDOperations'
import invariant from 'invariant'
import update from './update'
import solveClass from './solveClass'
import {extend, groupBy, startCase} from 'lodash'

let globalIdCounter = 1

/**
 * Variable types that must be solved as content rather than real children.
 */
const CONTENT_TYPES = {string: true, number: true}

/**
 * Renders the given react element with Telegram Bot API.
 *
 * @constructor ReactTelegramComponent
 * @extends ReactMultiChild
 */
export default class ReactTelegramComponent {
  constructor (element) {
    this.construct(element)
    this._tag = element.type.toLowerCase()
    this._updating = false
    this._renderedChildren = null
    this._previousStyle = null
    this._previousStyleCopy = null
    this._rootNodeID = null
    this._wrapperState = null
    this._topLevelWrapper = null
    this._nodeWithLegacyProperties = null
    this._currentNode = null
  }

  construct (element) {
    // Setting some properties
    this._currentElement = element
    this._eventListener = (type, ...args) => {
      if (this._updating) return

      const handler = this._currentElement.props['on' + startCase(type).replace(/ /g, '')]

      if (typeof handler === 'function') {
        if (type === 'focus' || type === 'blur') {
          args[0] = ReactTelegramIDOperations.get(this._rootNodeID)
        }
        handler(...args)
      }
    }
  }

  /**
   * Mounting the root component.
   *
   * @internal
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {?ReactTelegramComponent} the parent component instance
   * @param {?object} info about the host container
   * @param {object} context
   * @return {string} The computed markup.
   */
  mountComponent (
    transaction,
    hostParent = { _currentNode: ReactTelegramIDOperations.screen },
    hostContainerInfo,
    context
  ) {
    const rootID = globalIdCounter++
    this._rootNodeID = rootID

    // Mounting Telegram node
    const node = this.mountNode(
      hostParent._currentNode,
      this._currentElement
    )

    this._currentNode = node
    ReactTelegramIDOperations.add(this._rootNodeID, node)

    // Mounting children
    let childrenToUse = this._currentElement.props.children
    childrenToUse = childrenToUse === null ? [] : [].concat(childrenToUse)

    if (childrenToUse.length) {
      // Discriminating content components from real children
      const {content = null, realChildren = []} = groupBy(childrenToUse, (c) => {
        return CONTENT_TYPES[typeof c] ? 'content' : 'realChildren'
      })

      // Setting textual content
      if (content) { node.setContent('' + content.join('')) }

      // Mounting real children
      this.mountChildren(
        realChildren,
        transaction,
        context
      )
    }

    // Rendering the screen
    ReactTelegramIDOperations.screen.debouncedRender()
  }

  /**
   * Mounting the Telegram node itself.
   *
   * @param   {TelegramNode|TelegramScreen} parent  - The parent node.
   * @param   {ReactElement}              element - The element to mount.
   * @return  {TelegramNode}                       - The mounted node.
   */
  mountNode (parent, element) {
    const {props, type} = element
    const {children, ...options} = props // eslint-disable-line
    const telegramElement = telegram.widgets[type]

    invariant(
      !!telegramElement,
      `Invalid telegram element "${type}".`
    )

    const node = telegram.widgets[type](solveClass(options))

    node.on('event', this._eventListener)
    parent.append(node)

    return node
  }

  /**
   * Receive a component update.
   *
   * @param {ReactElement}              nextElement
   * @param {ReactReconcileTransaction} transaction
   * @param {object}                    context
   * @internal
   * @overridable
   */
  receiveComponent (nextElement, transaction, context) {
    const {props: {children, ...options}} = nextElement
    const node = ReactTelegramIDOperations.get(this._rootNodeID)

    this._updating = true
    update(node, solveClass(options))
    this._updating = false

    // Updating children
    const childrenToUse = children === null ? [] : [].concat(children)

    // Discriminating content components from real children
    const {content = null, realChildren = []} = groupBy(childrenToUse, (c) => {
      return CONTENT_TYPES[typeof c] ? 'content' : 'realChildren'
    })

    // Setting textual content
    if (content) { node.setContent('' + content.join('')) }

    this.updateChildren(realChildren, transaction, context)

    ReactTelegramIDOperations.screen.debouncedRender()
  }

  /**
   * Dropping the component.
   */
  unmountComponent () {
    this.unmountChildren()

    const node = ReactTelegramIDOperations.get(this._rootNodeID)

    node.off('event', this._eventListener)
    node.destroy()

    ReactTelegramIDOperations.drop(this._rootNodeID)

    this._rootNodeID = null

    ReactTelegramIDOperations.screen.debouncedRender()
  }

  /**
   * Getting a public instance of the component for refs.
   *
   * @return {TelegramNode} - The instance's node.
   */
  getPublicInstance () {
    return ReactTelegramIDOperations.get(this._rootNodeID)
  }

  getHostNode () {
    return ReactTelegramIDOperations.get(this._rootNodeID)
  }
}

/**
 * Extending the component with the MultiChild mixin.
 */
extend(
  ReactTelegramComponent.prototype,
  ReactMultiChild.Mixin
)
