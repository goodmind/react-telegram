# react-telegram

A [React](https://facebook.github.io/react/) custom renderer for the [Telegram Bot API](https://core.telegram.org/bots/api).

This renderer should currently be considered as experimental, is subject to change and will only work with the React's latest version (`15.0.x`).

## Summary

* [Installation](#installation)
* [Demo](#demo)
* [Usage](#usage)
  * [Rendering a basic application](#rendering-a-basic-application)
* [Contribution](#contribution)
* [License](#license)

## Installation

You can install `react-telegram` through npm:

```bash
# Be sure to install react>=15.0.0 before
npm install react@latest
npm install react-telegram
```

## Usage

### Rendering a basic application

```jsx
import React, {Component} from 'react';
import {render} from 'react-telegram';

// Rendering a simple centered box
class App extends Component {
  render() {
    return (
      <box top="center"
           left="center"
           width="50%"
           height="50%"
           border={{type: 'line'}}
           style={{border: {fg: 'blue'}}}>
        Hello World!
      </box>
    );
  }
}

// Rendering the React app using our screen
const component = render(<App />);
```

## Contribution

Contributions are obviously welcome.

Be sure to add unit tests if relevant and pass them all before submitting your pull request.

```bash
# Installing the dev environment
git clone git@github.com:goodmind/react-telegram.git
cd react-telegram
npm install

# Running the tests
npm test
```

## License

[MIT](LICENSE) (c) goodmind
