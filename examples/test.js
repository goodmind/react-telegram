'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lib = require('../lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = function App() {
  return _react2.default.createElement(
    'message',
    null,
    'Hello, world!',
    _react2.default.createElement(
      'inline-keyboard-markup',
      null,
      _react2.default.createElement('inline-button', null),
      ', ',
      _react2.default.createElement('inline-button', null),
      ', ',
      _react2.default.createElement('inline-button', null),
      _react2.default.createElement('inline-button', null),
      ', ',
      _react2.default.createElement('inline-button', null),
      ', ',
      _react2.default.createElement('inline-button', null),
      _react2.default.createElement('inline-button', null),
      ', ',
      _react2.default.createElement('inline-button', null),
      ', ',
      _react2.default.createElement('inline-button', null)
    )
  );
};

(0, _lib.render)(_react2.default.createElement(App, null), new _lib.Screen());
