import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Knob extends Component {
   static propTypes = {
      value: PropTypes.number,
      threshold: PropTypes.object,
      onChange: PropTypes.func,
      type: PropTypes.string,
      color: PropTypes.string,
   };

   static defaultProps = {
      value: 0,
      threshold: {
         min: 0,
         max: 127,
      },
      onChange: () => {},
      type: 'parameter',
      color: '#fff',
   };

   constructor(props) {
      super(props);

      this.knobRef = React.createRef();

      // The knob owns its value; `value` prop is only the starting position.
      this.state = {
         value: props.value,
         mouseDown: false,
         mouseX: 0,
         mouseY: 0,
         delta: Date.now(),
      };
   }

   componentDidMount() {
      window.addEventListener('pointerup', this.onMouseUp);
      window.addEventListener('pointercancel', this.onMouseUp);
      window.addEventListener('pointermove', this.onMouseMove);
   }

   componentWillUnmount() {
      window.removeEventListener('pointerup', this.onMouseUp);
      window.removeEventListener('pointercancel', this.onMouseUp);
      window.removeEventListener('pointermove', this.onMouseMove);
   }

   onMouseDown = (e) => {
      e.preventDefault(); // no text selection / touch scrolling while turning
      let knob = this.knobRef.current,
         knobRect = knob.getBoundingClientRect(),
         originX = knobRect.left + 21,
         originY = knobRect.top + 21,
         x = e.clientX - originX,
         y = e.clientY - originY,
         quad = 1;


      if (y < 0) {
         if (x > 0) {
            quad = 1;
         } else {
            quad = 2;
         }
      } else {
         if (x < 0) {
            quad = 3;
         } else {
            quad = 4;
         }
      }

      this.setState({
         mouseDown: true,
         mouseX: e.clientX,
         mouseY: e.clientY,
         delta: Date.now(),
         quad: quad,
      });
   };

   onMouseUp = () => {
      if (this.state.mouseDown) {
         this.setState({
            mouseDown: false,
         });
      }
   };

   onMouseMove = (e) => {
      if (!this.state.mouseDown) return;

      let dT = (Date.now() - this.state.delta) * 0.05;

      if (dT > 1) {
         let { value, quad } = this.state,
            { threshold } = this.props,
            dPosX = e.clientX - this.state.mouseX,
            dPosY = e.clientY - this.state.mouseY,
            dRotate = 0;

         if (Math.abs(dPosX) >= Math.abs(dPosY)) {
            if (quad == 1 || quad == 2) {
               dRotate = dPosX / dT;
            } else {
               dRotate = -dPosX / dT;
            }
         } else {
            if (quad == 1 || quad == 4) {
               dRotate = dPosY / dT;
            } else {
               dRotate = -dPosY / dT;
            }
         }

         value = Math.min(threshold.max, Math.max(threshold.min, value + dRotate));

         this.setState({
            value,
            mouseX: e.clientX,
            mouseY: e.clientY,
            delta: Date.now(),
         });

         if (value !== this.state.value) {
            this.props.onChange(value);
         }
      } else {
         this.setState({
            delta: Date.now(),
         });
      }
   };

   render() {
      const props = this.props,
         { min, max } = props.threshold,
         // Map the value onto a 300deg sweep, like a real pot.
         rotate = (this.state.value - min) / (max - min) * 300 - 150,
         parameter = props.type === 'parameter',
         style = {
            knob: {
               position: 'relative',
               top: '50%',
               left: '50%',
               backgroundColor: props.color,
               width: 42,
               height: 42,
               margin: parameter ? '-21px 0 0 -21px' : '-21px 0 0 -52px',
               MozBorderRadius: '50%',
               WebkitBorderRadius: '50%',
               borderRadius: '50%',
               cursor: this.state.mouseDown ? 'grabbing' : 'grab',
               touchAction: 'none',

               WebkitTransform: `rotate(${rotate}deg)`,
               transform: `rotate(${rotate}deg)`,
            },
            indent: {
               position: 'absolute',
               top: 7,
               left: 16,
               height: parameter ? 28 : 10,
               width: 10,
               borderRadius: '10px',
               WebkitBoxShadow: 'inset 0px 0px 1px 1px rgba(0,0,0,0.3)',
               MozBoxShadow: 'inset 0px 0px 1px 1px rgba(0,0,0,0.3)',
               boxShadow: 'inset 0px 0px 1px 1px rgba(0,0,0,0.3)',
            },
         };

      return (
         <div
            ref={ this.knobRef }
            style={ style.knob }
            onPointerDown={ this.onMouseDown }>
            <div style={ style.indent }></div>
         </div>
      );
   }
}
