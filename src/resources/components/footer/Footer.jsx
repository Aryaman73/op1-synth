import React, { Component } from 'react';

const DIM = '#4A4E4E';

export default class Footer extends Component {
  style = {
    wrapper: {
      width: 1133, // matches the synth body
      margin: '0 auto',
      padding: '16px 15px 32px',
      boxSizing: 'border-box',
      borderTop: '1px solid #1E2020',
      fontFamily: '\'Quicksand\', sans-serif',
      fontSize: '0.75rem',
      lineHeight: 1.7,
      textAlign: 'center',
      color: DIM,
    },
    link: {
      color: '#6B7070',
      textDecoration: 'none',
      borderBottom: `1px solid ${DIM}`,
    },
  };

  render() {
    const style = this.style;

    return (
      <footer style={ style.wrapper }>
        <div>
          Based on <a style={ style.link } href="https://github.com/klswn/op1-synth" target="_blank" rel="noopener noreferrer">Kyle Sweeney&rsquo;s open-source op1-synth</a> (MIT licence).
        </div>
        <div>
          An unofficial fan project, not affiliated with or endorsed by Teenage Engineering. OP-1 is a trademark of Teenage Engineering.
        </div>
      </footer>
    );
  }
}
