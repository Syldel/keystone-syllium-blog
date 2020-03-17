import { request } from 'graphql-request';

const SITEMAP_QUERY = `{
  allPosts (
    where: {status: published}
  ) {
    slug
  }
}`;

export default async function sitemapFunc(req, res) {

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

  res.header('Content-Type', 'application/xml');
  res.send(xml);
}
