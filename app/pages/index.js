import Link from 'next/link';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { jsx } from '@emotion/core';
import { format } from 'date-fns';

import Layout from '../templates/layout';
import Header from '../components/header';

/** @jsx jsx */

const Post = ({ post }) => {

  if (post && post.image && post.image.publicUrl) {
    post.image.thumbnailUrl = String(post.image.publicUrl).replace('upload/', 'upload/w_288/');
  }

  return (
    <Link href={`/post/[slug]?slug=${post.slug}`} as={`/post/${post.slug}`} passHref>
      <a
        css={{
          display: 'block',
          background: 'white',
          boxShadow: '0px 10px 20px hsla(200, 20%, 20%, 0.20)',
          marginBottom: 32,
          cursor: 'pointer',
          borderRadius: 6,
          overflow: 'hidden',
          ':hover': {
            textDecoration: 'none'
          },
        }}
      >
        <div className="row no-gutters">
          {post.image ? <img src={post.image.thumbnailUrl} css={{ width: '100%' }} className="col-sm-4" /> : <div css={{ backgroundColor: '#999' }} className="col-sm-4"></div>}
          <div className="col-sm-8">
            <article css={{ padding: '1em' }} >
              <h3 css={{ marginTop: 0 }}>{post.title}</h3>
              <section dangerouslySetInnerHTML={{ __html: post.intro }} css={{ color: 'hsl(200, 20%, 20%)' }}/>
              {post.showPostedBy ? 
              <div css={{ marginTop: '1em', borderTop: '1px solid hsl(200, 20%, 80%)' }}>
                <p css={{ fontSize: '0.8em', marginBottom: 0, color: 'hsl(200, 20%, 50%)' }}>
                  Posté par {post.author ? post.author.name : 'someone'} le{' '}
                  {format(post.posted, 'DD/MM/YYYY')}
                </p>
              </div> : null}
            </article>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default () => (
  <Layout>
    <Header />
    <section css={{ margin: '48px 0' }}>
      <h2>À propos</h2>
      <p>
        Ce blog est dédié à ma passion pour la photographie. J'ai envie de partager avec vous mes voyages, mes avis, mes expériences.
        Bref, tout ce qui peut être intéressant dans le domaine de la photographie. J'espère que ça vous plaira.
      </p>
    </section>

    <section css={{ margin: '48px 0' }}>
      <h2>Les derniers articles</h2>
      <Query
        query={gql`
          {
            allPosts (
              where: {status: published}
            ) {
              title
              id
              intro
              body
              posted
              slug
              image {
                publicUrl
              }
              author {
                name
              }
              showPostedBy
            }
          }
        `}
      >
        {({ data, loading, error }) => {
          if (loading) return <p>loading...</p>;
          if (error) return <p>Error!</p>;
          return (
            <div>
              {data.allPosts.length ? (
                data.allPosts.map(post => <Post post={post} key={post.id} />)
              ) : (
                <p>No posts to display</p>
              )}
            </div>
          );
        }}
      </Query>
    </section>
  </Layout>
);
