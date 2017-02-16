import React from 'react'
import { Telegram, Screen } from '../lib'
import createMemoryHistory from 'history/lib/createMemoryHistory'
import { Router, Route, Link } from 'react-router'

const App = ({ children }) => children
const Start = ({ location: { state } }) => {
  return (
    <message to={state.msg.from}>
      Hello, world!
      <inline-keyboard-markup>
        <Link to="/ping">Ping</Link>
      </inline-keyboard-markup>
    </message>
  )
}
const NoMatch = ({ location: { state } }) => (
  <message to={state.msg.from}>
    Unknown route
  </message>
)
const Pong = ({ location: { state } }) => (
  <message to={state.msg.from}>
    Pong
    <inline-keyboard-markup>
      <Link to="/start">Back</Link>
    </inline-keyboard-markup>
  </message>
)


const ACCESS_TOKEN = process.env.TOKEN
const history = createMemoryHistory()
const bot = new Telegram(ACCESS_TOKEN, history)

bot.history.listen((location, action) => {
  console.log(action, location.pathname, location.state)
})

bot.connect()
bot.render((
  <Router history={bot.history}>
    <Route path="/" component={App}>
      <Route path="start" component={Start} />
      <Route path="ping" component={Pong} />
      <Route path="*" component={NoMatch} />
    </Route>
  </Router>
), new Screen(bot))

