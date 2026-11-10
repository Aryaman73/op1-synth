import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Shrinks fixed-size children (the synth is a 1133x412 pixel layout) to fit
// the window, so the whole instrument is visible on phones (including
// landscape, where height is the limit) and small windows. Never scales up.
// Below this, fitting the height would make the synth uselessly small; let the
// page scroll instead.
const MIN_HEIGHT = 200;

export default class ScaleToFit extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    gutter: PropTypes.number, // space kept free on each side
  };

  static defaultProps = {
    gutter: 8,
  };

  state = { scale: 1 };

  componentDidMount() {
    this.update();
    window.addEventListener('resize', this.update);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.update);
  }

  update = () => {
    const { width, height, gutter } = this.props;
    // clientWidth excludes any vertical scrollbar.
    const availableWidth = document.documentElement.clientWidth - gutter * 2;
    // Height left below whatever sits above us (the title).
    const top = this.el ? this.el.getBoundingClientRect().top + window.scrollY : 0;
    const availableHeight = window.innerHeight - top - gutter;

    this.setState({
      scale: Math.min(1, availableWidth / width, Math.max(availableHeight, MIN_HEIGHT) / height),
    });
  };

  render() {
    const { width, height, children } = this.props;
    const { scale } = this.state;

    return (
      // flow-root contains the synth's floats; otherwise they leak out at their
      // unscaled height and push the content below down.
      <div
        ref={ el => this.el = el }
        style={ { width: width * scale, height: height * scale, margin: '0 auto', display: 'flow-root' } }
      >
        <div style={ { width, height, transform: `scale(${scale})`, transformOrigin: 'top left', display: 'flow-root' } }>
          { children }
        </div>
      </div>
    );
  }
}
