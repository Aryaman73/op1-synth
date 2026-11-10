import React, { Component } from 'react';
import Synth from '../synth/Synth.jsx';
import Instructions from '../instructions/Instructions.jsx';
import Footer from '../footer/Footer.jsx';
import ScaleToFit from '../scale-to-fit/ScaleToFit.jsx';

class App extends Component {
   style = {
      wrapper: {
         backgroundColor: '#000',
         minHeight: '100vh',
         overflowX: 'hidden',
         boxSizing: 'border-box',
         paddingTop: 'min(24px, 3vh)',
      },
      title: {
         maxWidth: 1133, // matches the synth body
         margin: '0 auto min(20px, 3vh)',
         fontFamily: '\'Bungee Hairline\', cursive',
         fontSize: 'clamp(1.25rem, min(6vw, 8vh), 4rem)', // smaller on narrow or short (landscape phone) screens
         fontWeight: 400,
         letterSpacing: '0.35em',
         paddingLeft: '0.35em', // offsets the trailing letter-space so it centers
         boxSizing: 'border-box',
         lineHeight: 1,
         textAlign: 'center',
         color: '#C3C9C9',
         userSelect: 'none',
      },
      rotateHint: {
         margin: '14px auto 0',
         padding: '0 16px',
         fontFamily: '\'Quicksand\', sans-serif',
         fontSize: '0.8rem',
         textAlign: 'center',
         color: '#6B7070',
      },
   };

   state = { portraitPhone: false };

   componentDidMount() {
      this.portraitQuery = window.matchMedia('(orientation: portrait) and (max-width: 700px)');
      this.onOrientation();
      this.portraitQuery.addEventListener('change', this.onOrientation);
   }

   componentWillUnmount() {
      this.portraitQuery.removeEventListener('change', this.onOrientation);
   }

   onOrientation = () => {
      this.setState({ portraitPhone: this.portraitQuery.matches });
   };

   render() {
      const style = this.style;

      return (
         <div style={ style.wrapper }>
            <h1 style={ style.title }>{ 'OP1ONLINE' }</h1>
            <ScaleToFit width={ 1133 } height={ 412 }>
               <Synth />
            </ScaleToFit>
            { this.state.portraitPhone && (
               <div style={ style.rotateHint }>Turn your phone sideways for bigger keys.</div>
            ) }
            <Instructions />
            <Footer />
         </div>
      );
   }
}

export default App;
