import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Key from './Key.jsx';

export default class Keyboard extends Component {
  renderBlackKeys = () => {
    return this.props.keys.valueSeq().map((key, index) => {
      const props = key.toJS();

      if (props.type === 'black') {
        return (
          <Key
            { ...props }
            borderRight={ props.id !== 22 }
            key={ index } />
        );
      }
    });
  };

  renderWhiteKeys = () => {
    return this.props.keys.valueSeq().map((key, index) => {
      const props = key.toJS();

      if (props.type === 'white') {
        return (
          <Key
            { ...props }
            borderRight={ props.id !== 23 }
            key={ index } />
        );
      }
    });
  };

  render() {
    return (
      <div>
        { this.renderBlackKeys() }
        { this.renderWhiteKeys() }
      </div>
    );
  }
}
