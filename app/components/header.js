import Link from 'next/link';
import React from 'react';
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
        <div>loading...</div>
      )
    }

    const logoPath = 'public/images/syllium-diaph.svg';
    let absLogoPath = logoPath;
    if (typeof window !== 'undefined') {
      absLogoPath = `${window.location.origin}/${logoPath}`;
    }

    return (
      <header
        css={{
          display: 'flex',
          alignItems: 'center',
          margin: '48px 0',
        }}
      >
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
      </header>
    );
  }
}

export default Header;