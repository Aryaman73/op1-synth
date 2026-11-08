import React, { Component } from 'react';
import Synth from '../synth/Synth.jsx';
import Instructions from '../instructions/Instructions.jsx';
import Footer from '../footer/Footer.jsx';

class App extends Component {
   style = {
      wrapper: {
         backgroundColor: '#000',
         minHeight: '100vh',
         overflowX: 'hidden',
         boxSizing: 'border-box',
         paddingTop: 24,
      },
      title: {
         width: 1133, // matches the synth body
         margin: '0 auto 20px',
         fontFamily: '\'Bungee Hairline\', cursive',
         fontSize: '4rem',
         fontWeight: 400,
         letterSpacing: '0.35em',
         paddingLeft: '0.35em', // offsets the trailing letter-space so it centers
         boxSizing: 'border-box',
         lineHeight: 1,
         textAlign: 'center',
         color: '#C3C9C9',
         userSelect: 'none',
      },
   };

   render() {
      const style = this.style;

      return (
         <div style={ style.wrapper }>
            <h1 style={ style.title }>{ 'OP1ONLINE' }</h1>
            <Synth />
            <Instructions />
            <Footer />
         </div>
      );
   }
}

export default App;
