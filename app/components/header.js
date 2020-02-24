import Link from 'next/link';
import React from 'react';

import Nav from './nav.js';
import Loading from './loading';

import { jsx } from '@emotion/core';

/** @jsx jsx */

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ssrDone: false
    };
  }
  componentDidMount() {
    this.setState({ ssrDone: true, online: navigator.onLine })
  }
  render() {
    if (!this.state.ssrDone) {
      return <Loading />;
    }

    const logoPath = 'images/syllium-diaph.svg';
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
        <Nav data={this.props.data} />
      </header>
    );
  }
}

export default Header;