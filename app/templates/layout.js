import Head from 'next/head';
import { jsx, Global } from '@emotion/core';

/** @jsx jsx */

const Layout = ({ children }) => (
  <>
    <Global
      styles={{
        '*': { boxSizing: 'border-box' },
        body: {
          margin: 0,
          background: 'hsl(200, 20%, 90%)',
          color: 'hsl(200, 20%, 20%)',
          fontFamily: "'Lato', sans-serif",
        },
        h2: {
          fontSize: '1em',
          textTransform: 'uppercase',
          color: 'hsl(200, 20%, 50%)',
        },
      }}
    />
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <title>Syllium Photography Blog</title>
      <link rel="icon" href="../images/favicon.ico" />
      <link rel="stylesheet" type="text/css" href="../styles/bootstrap.min.css"></link>
    </Head>
    <div
      css={{
        padding: '0 48px',
        width: '100%',
        maxWidth: 960,
        margin: '0 auto',
      }}
    >
      {children}
      <footer
        css={{
          width: '100%',
          textAlign: 'center',
          margin: '48px 0',
          color: 'hsl(200, 20%, 50%)',
        }}
      >
        {/*
        Built with KeystoneJS.{' '}
        <a
          href="/admin"
          css={{
            color: 'hsl(200, 20%, 50%)',
            fontWeight: 800,
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Go to Admin Console
        </a>
        .
        */}
      </footer>
    </div>
  </>
);

export default Layout;
