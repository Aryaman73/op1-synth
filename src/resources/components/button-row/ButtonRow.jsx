import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../button/Button.jsx';

export default class ButtonRow extends Component {
  render() {
    const { oscKeys, onPress } = this.props;
    const style = {
      number: {
        fontFamily: '\'Quicksand\', sans-serif',
        fontSize: '1.5rem',
        position: 'relative',
        top: 7,
        textAlign: 'center',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
      },
      arrow: {
        fontFamily: '\'Quicksand\', sans-serif',
        fontSize: '1.5rem',
        position: 'relative',
        top: 4,
        textAlign: 'center',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }
    };

    return (
      <div>
        <Button />
        <Button />
        <Button />
        <Button />
        <Button isPressed={ oscKeys.indexOf(49) > -1 } onClick={ () => onPress(49) }>
          <div style={ style.number }>{ '1' }</div>
        </Button>
        <Button isPressed={ oscKeys.indexOf(50) > -1 } onClick={ () => onPress(50) }>
          <div style={ style.number }>{ '2' }</div>
        </Button>
        <Button isPressed={ oscKeys.indexOf(51) > -1 } onClick={ () => onPress(51) }>
          <div style={ style.number }>{ '3' }</div>
        </Button>
        <Button isPressed={ oscKeys.indexOf(52) > -1 } onClick={ () => onPress(52) }>
          <div style={ style.number }>{ '4' }</div>
        </Button>
        <Button isPressed={ this.props.arrowKey === 53 } onClick={ () => onPress(53) }>
          <div style={ style.arrow }>{ '<' }</div>
        </Button>
        <Button isPressed={ this.props.arrowKey === 54 } onClick={ () => onPress(54) }>
          <div style={ style.arrow }>{ '>' }</div>
        </Button>
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button borderRight={ false } />
       </div>
    );
  }
}

ButtonRow.defaultProps = {
  onPress: () => {},
};

ButtonRow.propTypes = {
  oscKeys: PropTypes.array,
  arrowKey: PropTypes.number,
  onPress: PropTypes.func,
};
