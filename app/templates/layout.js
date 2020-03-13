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
      <meta name="description" content="Ce blog est dédié à ma passion pour la photographie. Je partage avec vous mes voyages, mes avis, mes expériences." />
      <link rel="icon" href="../images/favicon.ico" />
      <link rel="stylesheet" type="text/css" href="../styles/lato-font.css" />
      <link rel="stylesheet" type="text/css" href="../styles/bootstrap.min.css" />
    </Head>
    <div
      css={{
        padding: '0 12px',
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
        <a
          href="https://www.instagram.com/syldel"
          css={{
            color: 'hsl(200, 20%, 50%)',
            fontWeight: 800,
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        ><img css={{
          marginRight: '5px'
        }} src="../images/instagram-glyph-logo.png" alt="instagram" height="14" width="14"/>Follow me on Instagram</a>
        <br/>
        <a
          href="https://www.syllium-photography.fr/"
          css={{
            color: 'hsl(200, 20%, 50%)',
            fontWeight: 800,
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >www.syllium-photography.fr</a>
      </footer>
    </div>
  </>
);

export default Layout;
