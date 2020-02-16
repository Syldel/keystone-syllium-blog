import Link from 'next/link';
import { jsx } from '@emotion/core';

/** @jsx jsx */

export default () => (
  <header
    css={{
      display: 'flex',
      alignItems: 'center',
      margin: '48px 0',
    }}
  >
    <img src="public/images/syllium-diaph.svg" alt="logo" css={{width: '80px'}} />
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
