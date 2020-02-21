import React from 'react';
import { Router } from 'next/router';
import Loading from './loading';
import ActiveLink from './active-link';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

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
      return <Loading />;
    }

    return <Query
      query={gql`
        {
          allNavItems (
            where: {published: true}
          ) {
            id
            name
            href
            target
          }
        }
      `}
    >
      {({ data, loading, error }) => {
        if (loading) return <Loading />;
        if (error) return <p>Error!</p>;
        if (!data || !data.allNavItems) return <p>Error!</p>;

        return (
          <nav className="navbar">
            <ul className="nav">
              {data.allNavItems.map(({ id, href, name, target }) => (
                <li className="nav-item" key={id}>
                  <ActiveLink activeClassName="active" href={href} target={target}>
                    <a className="nav-link">{name}</a>
                  </ActiveLink>
                </li>
              ))}
            </ul>

            <style jsx>{`
              .navbar {
                background-color: hsl(200,20%,50%);
                padding: 0.5rem;
                margin-top: 2rem;
                box-shadow: 0px 10px 20px hsla(200, 20%, 20%, 0.20);
                border-radius: 6px;
              }
              .nav-link {
                color: #ccc;
              }
              .nav-link.active {
                color: hsl(200,20%,50%);
                background-color: #eee;
                border-radius: 6px;
              }
              .nav-link.active:hover {
                color: hsl(200,20%,50%);
              }
              .nav-link:hover {
                color: #fff;
              }

              /*:global(body) {
                margin: 0;
                font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
                  Helvetica, sans-serif;
              }*/
            `}</style>

          </nav>);
      }}
    </Query>

  }
}

export default Nav;