/**
 * React Telegram Update Schemes
 * =============================
 *
 * Applying updates to Telegram nodes correctly.
 */
import _ from 'lodash'

const RAW_ATTRIBUTES = new Set([

  // Alignment, Orientation & Presentation
  'align',
  'valign',
  'orientation',
  'shrink',
  'padding',
  'tags',
  'shadow',

  // Font-related
  'font',
  'fontBold',
  'fch',
  'ch',
  'bold',
  'underline',

  // Flags
  'clickable',
  'input',
  'keyable',
  'hidden',
  'visible',
  'scrollable',
  'draggable',
  'interactive',

  // Position
  'left',
  'right',
  'top',
  'bottom',
  'aleft',
  'aright',
  'atop',
  'abottom',

  // Size
  'width',
  'height',

  // Checkbox
  'checked',

  // Misc
  'name'
])

/**
 * Updates the given Telegram node.
 *
 * @param {TelegramNode} node    - Node to update.
 * @param {object}      options - Props of the component without children.
 */
export default function update (node, options) {
  // TODO: enforce some kind of shallow equality?
  // TODO: handle position

  const selectQue = []

  /* eslint-disable brace-style */
  for (let key in options) {
    let value = options[key]

    if (key === 'selected' && node.select) {
      selectQue.push({
        node,
        value: (typeof value === 'string' ? +value : value)
      })
    }

    // Setting label
    else if (key === 'label') { node.setLabel(value) }

    // Removing hoverText
    else if (key === 'hoverText' && !value) node.removeHover()

    // Setting hoverText
    else if (key === 'hoverText' && value) node.setHover(value)

    // Setting content
    else if (key === 'content') { node.setContent(value) }

    // Updating style
    else if (key === 'style') { node.style = _.merge({}, node.style, value) }

    // Updating items
    else if (key === 'items') { node.setItems(value) }

    // Border edge case
    else if (key === 'border') { node.border = _.merge({}, node.border, value) }

    // Textarea value
    else if (key === 'value' && node.setValue) { node.setValue(value) }

    // Progress bar
    else if (key === 'filled' && node.filled !== value) { node.setProgress(value) }

    // Table / ListTable rows / data
    else if ((key === 'rows' || key === 'data') && node.setData) { node.setData(value) } else if (key === 'focused' && value && !node[key]) node.focus()

    // Raw attributes
    else if (RAW_ATTRIBUTES.has(key)) { node[key] = value }
  }
  /* eslint-enable brace-style */

  selectQue.forEach(({node, value}) => node.select(value))
}
