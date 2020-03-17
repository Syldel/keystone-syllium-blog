import { request } from 'graphql-request';
import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const SITEMAP_QUERY = `{
  allPosts (
    where: {status: published}
  ) {
    slug
  }
}`;

const SITEMAP_GQL_QUERY = gql`${SITEMAP_QUERY}`;

class Sitemap extends React.Component {

  static async getInitialProps({ req, res }) {
    console.log('getInitialProps');
    res.setHeader("Content-Type", "text/xml");

    console.log('Sitemap - 1. req.hostname', req.hostname);
    let hostname = req.hostname;
    if (req.headers && req.headers.host) {
      hostname = req.headers.host;
    }
    console.log('Sitemap - 2. hostname', hostname);
    let protocol = req.protocol || 'https';
    console.log('Sitemap - 1. protocol', protocol);
    if (req.headers && req.headers['x-forwarded-proto']) {
      protocol = req.headers['x-forwarded-proto'];
    }
    console.log('Sitemap - 2. protocol', protocol);
    //const requestUrl = `${protocol}://${hostname}/`;
    //const siteOrigin = `https://${hostname}/`;

    const requestUrl = `https://blog.syllium-photography.fr/`;
    const siteOrigin = requestUrl;

    let xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    xml += `<url>`;
    xml += `<loc>${siteOrigin}</loc>`;
    xml += `<changefreq>monthly</changefreq>`;
    xml += `<priority>0.8</priority>`;
    xml += `</url>`;

    const data = await request(`${requestUrl}admin/api`, SITEMAP_QUERY);
    if (data && data.allPosts) {
      data.allPosts.forEach(postObj => {
          xml += `<url>`;
          xml += `<loc>${siteOrigin}post/${postObj.slug}</loc>`;
          xml += `<changefreq>monthly</changefreq>`;
          xml += `<priority>0.8</priority>`;
          xml += `</url>`;
      });
    }

    xml += '</urlset>';

    res.write(xml);
    res.end();
  }

  constructor(props) {
    super(props);
    this.state = {
      ssrDone: false
    };
  }

  componentDidMount() {
    console.log('componentDidMount()');
    this.currentWindowLocation = window.location;
    this.setState({ ssrDone: true });
  }

  render() {
    console.log('render()');
    if (!this.state.ssrDone) {
      return 'loading...';
    }

    console.log('this.currentWindowLocation', this.currentWindowLocation);
    const siteOrigin = this.currentWindowLocation.origin;
    console.log('Sitemap - 2. siteOrigin', siteOrigin);

    let xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    xml += `<url>`;
    xml += `<loc>${siteOrigin}</loc>`;
    xml += `<changefreq>monthly</changefreq>`;
    xml += `<priority>0.8</priority>`;
    xml += `</url>`;

    return (
        <Query query={gql`${SITEMAP_QUERY}`} >
          {({ data, loading, error }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error!</p>;

            if (data && data.allPosts) {
              data.allPosts.forEach(postObj => {
                xml += `<url>`;
                xml += `<loc>${siteOrigin}post/${postObj.slug}</loc>`;
                xml += `<changefreq>monthly</changefreq>`;
                xml += `<priority>0.8</priority>`;
                xml += `</url>`;
              });
            }

            xml += '</urlset>';

            return xml;
          }}
        </Query>
    );
  }
}

export default Sitemap;