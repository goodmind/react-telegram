import { Message } from './Message'
import { InlineButton } from './InlineButton'
import { InlineKeyboardMarkup } from './InlineKeyboardMarkup'
import { Widget } from './Widget'

const h = (Class = Widget) => props => new Class(props)

export const widgets = {
  'message': h(Message),
  'inline-keyboard-markup': h(InlineKeyboardMarkup),
  'inline-button': h(InlineButton),
  'inline-row': h(),
  'a': h(InlineButton)
}
