import React from 'react';
import Link from 'next/link';

const links = [
  { href: 'https://zeit.co/now', label: 'ZEIT' },
  { href: 'https://github.com/zeit/next.js', label: 'GitHub' }
].map(link => {
  link.key = `nav-link-${link.href}-${link.label}`;
  return link;
});

class Nav extends React.Component {
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
    if (!this.state.ssrDone) {
      return (
        <div className="d-flex justify-content-center">
          <div className="spinner-grow text-dark" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }

    return (
      <nav className="navbar">
        <ul className="nav">
          <li className="nav-item">
            <Link href="/">
              <a className="nav-link">Accueil</a>
            </Link>
          </li>
          {links.map(({ key, href, label }) => (
            <li className="nav-item" key={key}>
              <a className="nav-link" href={href}>{label}</a>
            </li>
          ))}
        </ul>

        {/*<style jsx>{`
      :global(body) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
          Helvetica, sans-serif;
      }
      nav {
        text-align: center;
      }
      ul {
        display: flex;
        justify-content: space-between;
      }
      nav > ul {
        padding: 4px 16px;
      }
      li {
        display: flex;
        padding: 6px 8px;
      }
      a {
        color: #067df7;
        text-decoration: none;
        font-size: 13px;
      }
    `}</style>*/}
      </nav>);
  }
}

export default Nav;