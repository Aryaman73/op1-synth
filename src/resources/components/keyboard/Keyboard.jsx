import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Key from './Key.jsx';

// Mouse and touch play the on-screen keys. Each pointer (mouse, or each finger
// for multi-touch) holds at most one key; sliding onto another key moves the
// note there, like running a finger along a real keyboard.
export default class Keyboard extends Component {
  static propTypes = {
    onNoteOn: PropTypes.func,
    onNoteOff: PropTypes.func,
  };

  static defaultProps = {
    onNoteOn: () => {},
    onNoteOff: () => {},
  };

  style = {
    // Stop the browser scrolling/zooming or opening the long-press menu, so
    // touches reach the keys.
    touchAction: 'none',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTouchCallout: 'none',
  };

  // pointerId -> key index currently held by that pointer
  pointers = new Map();

  // Key under a screen point, or null. Works with the layout scaled down.
  keyAt = (x, y) => {
    const el = document.elementFromPoint(x, y);
    const keyEl = el && el.closest('[data-key-index]');

    return keyEl ? Number(keyEl.dataset.keyIndex) : null;
  };

  moveTo = (pointerId, index) => {
    const current = this.pointers.has(pointerId) ? this.pointers.get(pointerId) : null;

    if (current === index) {
      return;
    }

    if (current !== null) {
      this.props.onNoteOff(current);
    }

    if (index !== null) {
      this.props.onNoteOn(index);
    }

    this.pointers.set(pointerId, index);
  };

  onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) {
      return;
    }

    e.preventDefault();
    // Keep receiving this pointer's moves/up even when it leaves the keyboard.
    // Throws if the pointer is already gone (e.g. a very quick tap).
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {
      // Not fatal: pointerup on the keyboard still ends the note.
    }
    this.moveTo(e.pointerId, this.keyAt(e.clientX, e.clientY));
  };

  onPointerMove = (e) => {
    if (this.pointers.has(e.pointerId)) {
      this.moveTo(e.pointerId, this.keyAt(e.clientX, e.clientY));
    }
  };

  onPointerUp = (e) => {
    if (this.pointers.has(e.pointerId)) {
      this.moveTo(e.pointerId, null);
      this.pointers.delete(e.pointerId);
    }
  };

  renderKeys = (type) => {
    return this.props.keys.valueSeq().map((key, index) => {
      const props = key.toJS();

      if (props.type === type) {
        return (
          <Key
            { ...props }
            borderRight={ props.id !== (type === 'black' ? 22 : 23) }
            key={ index } />
        );
      }
    });
  };

  render() {
    return (
      <div
        style={ this.style }
        onPointerDown={ this.onPointerDown }
        onPointerMove={ this.onPointerMove }
        onPointerUp={ this.onPointerUp }
        onPointerCancel={ this.onPointerUp }
        onLostPointerCapture={ this.onPointerUp }
      >
        { this.renderKeys('black') }
        { this.renderKeys('white') }
      </div>
    );
  }
}
