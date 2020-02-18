import Link from 'next/link';
import React from 'react';

import Nav from './nav.js';

import { jsx } from '@emotion/core';

/** @jsx jsx */

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ssrDone: false
    }
  }
  componentDidMount() {
    this.setState({ ssrDone: true, online: navigator.onLine })
  }
  render() {
    if(!this.state.ssrDone) {
      return (
        <div className="d-flex justify-content-center">
          <div className="spinner-grow text-dark" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }

    const logoPath = 'public/images/syllium-diaph.svg';
    let absLogoPath = logoPath;
    if (typeof window !== 'undefined') {
      absLogoPath = `${window.location.origin}/${logoPath}`;
    }

    return (
      <header
        css={{
          margin: '36px 0',
        }}
      >
        <div css={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <img src={absLogoPath} alt="logo" css={{width: '80px'}} />
          <Link href="/" passHref>
            <a css={{
              color: 'hsl(200, 20%, 50%)',
              margin: '0 0 0 1rem',
              lineHeight: '2.2rem',
              fontSize: '2em',
              ':hover': {
                textDecoration: 'none'
              },
            }}>Syllium Photography Blog</a>
          </Link>
          {/*
          <Link href="/post/new" passHref>
            <a css={{ color: 'hsl(200, 20%, 50%)', cursor: 'pointer' }}>+ Add Post</a>
          </Link>
          */}
        </div>
        <Nav />
      </header>
    );
  }
}

export default Header;