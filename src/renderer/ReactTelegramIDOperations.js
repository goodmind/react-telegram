/**
 * React Telegram ID Operations
 * ============================
 *
 * Cache register for Telegram nodes stored by ID.
 */
import {debounce} from 'lodash'

/**
 * The Telegram nodes internal index;
 */
const telegramNodes = {}

/**
 * Backend for Telegram ID operations.
 *
 * @constructor ReactTelegramIDOperations
 */
class ReactTelegramIDOperations {
  constructor () {
    this.screen = null
  }

  /**
   * Set the current screen.
   *
   * @param  {TelegramScreen} screen     - The screen to attach.
   * @return {ReactTelegramIDOperations} - Returns itself.
   */
  setScreen (screen) {
    this.screen = screen

    // Creating a debounced version of the render method so we won't render
    // multiple time per frame, in vain.
    screen.debouncedRender = debounce(() => screen.render(), 0)

    return this
  }

  /**
   * Add a new node to the index.
   *
   * @param  {string}      ID           - The node's id.
   * @param  {TelegramNode} node         - The node itself.
   * @return {ReactTelegramIDOperations} - Returns itself.
   */
  add (ID, node) {
    telegramNodes[ID] = node
    return this
  }

  /**
   * Get a node from the index.
   *
   * @param  {string}      ID - The node's id.
   * @return {TelegramNode}    - The node.
   */
  get (ID) {
    return telegramNodes[ID]
  }

  /**
   * Get the parent of a node from the index.
   *
   * @param  {string}                    ID - The node's id.
   * @return {TelegramScreen|TelegramNode}    - The node.
   */
  getParent (ID) {
    // If the node is root, we return the screen itself
    if (ID.match(/\./g).length === 1) { return this.screen }

    const parentID = ID.split('.').slice(0, -1).join('.')
    return this.get(parentID)
  }

  /**
   * Drop a node from the index.
   *
   * @param  {string}                   ID - The node's id.
   * @return {ReactTelegramIDOperations}    - Returns itself.
   */
  drop (ID) {
    delete telegramNodes[ID]
    return this
  }
}

export default new ReactTelegramIDOperations()
