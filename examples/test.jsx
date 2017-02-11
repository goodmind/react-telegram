import React from 'react'
import { render, Screen } from '../lib'

const App = () => (
  <message>
    Hello, world!
    <inline-keyboard-markup>
      <inline-button />, <inline-button />, <inline-button />
      <inline-button />, <inline-button />, <inline-button />
      <inline-button />, <inline-button />, <inline-button />
    </inline-keyboard-markup>
  </message>
)

render(<App />, new Screen())

