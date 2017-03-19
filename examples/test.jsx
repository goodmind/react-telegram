import React from 'react'
import { Telegram, Screen } from '../lib'
import createMemoryHistory from 'history/lib/createMemoryHistory'
import { syncHistoryWithStore } from 'react-router-redux'
import RouterContext from 'react-router/lib/RouterContext'
import { Router, Route, Link, match } from 'react-router'
import { Provider } from 'react-redux'
import configureStore from './store'

const App = ({ children }) => children
const Start = ({ location: { state } }) => {
  return (
    <message to={state.msg.from} edit={!state.new}>
      Hello, world!
      <inline-keyboard-markup>
        <Link to="/ping">Ping</Link>
      </inline-keyboard-markup>
    </message>
  )
}
const NoMatch = ({ location: { state } }) => (
  <message to={state.msg.chat} edit={!state.new}>
    Unknown route
  </message>
)
const Pong = ({ location: { state } }) => (
  <message to={state.msg.chat} edit={!state.new}>
    Pong
    {!state.new && <inline-keyboard-markup>
        <Link to="/start">Back</Link>
    </inline-keyboard-markup>}
  </message>
)

const ACCESS_TOKEN = process.env.TOKEN
const bot = new Telegram(ACCESS_TOKEN)

const contexts = {}
const getRoutes = () => (
  <Route path="/" component={App}>
    <Route path="start" component={Start} />
    <Route path="ping" component={Pong} />
    <Route path="*" component={NoMatch} />
  </Route>
)

// TODO: better solution for session rendering

bot.connect()
bot.on('/start', msg => {
  const id = `${msg.from.id}_${msg.chat.id}`
  if (contexts[id]) {
    console.log('Context already created, handling history...')
    return
  } else {
    console.log('Creating context...', msg.from, contexts)
    contexts[id] = () => {
      const botHistory = bot.useHistory(createMemoryHistory())
      bot.pushHistory(botHistory, '/start', { data: undefined, msg, new: true })
      const store = configureStore(botHistory)
      const history = syncHistoryWithStore(botHistory, store)

      bot.render((
        <Provider store={store} key="provider">
          <Router history={history}>
            {getRoutes()}
          </Router>
        </Provider>
      ), new Screen(bot))
    }
    contexts[id]()
  }
})
