import Head from 'next/head';
import Link from 'next/link';

import gql from 'graphql-tag';
import React from 'react';
import { Mutation, Query } from 'react-apollo';
import { useState } from 'react';

import { jsx } from '@emotion/core';
import { format } from 'date-fns';

import Layout from '../../templates/layout';
import Header from '../../components/header';

/** @jsx jsx */

const ADD_COMMENT = gql`
  mutation AddComment($body: String!, $author: ID!, $postId: ID!, $posted: DateTime!) {
    createComment(
      data: {
        body: $body
        author: { connect: { id: $author } }
        originalPost: { connect: { id: $postId } }
        posted: $posted
      }
    ) {
      id
      body
      author {
        name
        avatar {
          publicUrl
        }
      }
      posted
    }
  }
`;

const ALL_QUERIES = gql`
  query AllQueries($slug: String) {
    allPosts(where: { slug: $slug }) {
      id
      title
      slug
      intro
      body
      posted
      image {
        publicUrl
      }
      author {
        name
      }
      showPostedBy
    }

    allComments(where: { originalPost: { slug: $slug } }) {
      id
      body
      author {
        name
        avatar {
          publicUrl
        }
      }
      posted
    }

    allUsers {
      name
      email
      id
    }
  }
`;

const imagePlaceholder = name => `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width="100" height="100">
<rect width="100" height="100" fill="hsl(200,20%,50%)" />
<text text-anchor="middle" x="50" y="67" fill="white" style="font-size: 50px; font-family: 'Lato', sans-serif;">
${name.charAt(0)}</text></svg>`;

const Comments = ({ data }) => (
  <div>
    <h2>Commentaires</h2>
    {data.allComments.length
      ? data.allComments.map(comment => (
          <div
            key={comment.id}
            css={{
              marginBottom: 32,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img
              src={
                comment.author.avatar
                  ? comment.author.avatar.publicUrl
                  : imagePlaceholder(comment.author.name)
              }
              css={{ width: 48, height: 48, borderRadius: 32 }}
            />
            <div css={{ marginLeft: 16 }}>
              <p
                css={{
                  color: 'hsl(200,20%,50%)',
                  fontSize: '0.8em',
                  fontWeight: 800,
                  margin: '8px 0',
                }}
              >
                {comment.author.name} le {format(comment.posted, 'DD MMM YYYY')}
              </p>
              <p css={{ margin: '8px 0' }}>{comment.body}</p>
            </div>
          </div>
        ))
      : 'No comments yet'}
  </div>
);

const AddComments = ({ users, post }) => {
  let user = users.filter(u => u.email == 'user@keystonejs.com')[0];
  let [comment, setComment] = useState('');

  return (
    <div>
      <h2>Ajouter un nouveau commentaire</h2>
      <Mutation
        mutation={ADD_COMMENT}
        update={(cache, { data: data }) => {
          const { allComments, allUsers, allPosts } = cache.readQuery({
            query: ALL_QUERIES,
            variables: { slug: post.slug },
          });

          cache.writeQuery({
            query: ALL_QUERIES,
            variables: { slug: post.slug },
            data: {
              allPosts,
              allUsers,
              allComments: allComments.concat([data.createComment]),
            },
          });
        }}
      >
        {createComment => (
          <form
            onSubmit={e => {
              e.preventDefault();

              createComment({
                variables: {
                  body: comment,
                  author: user.id,
                  postId: post.id,
                  posted: new Date(),
                },
              });

              setComment('');
            }}
          >
            <textarea
              type="text"
              placeholder="Votre commentaire"
              name="comment"
              css={{
                padding: 12,
                fontSize: 16,
                width: '100%',
                height: 60,
                border: 0,
                borderRadius: 6,
                resize: 'none',
              }}
              value={comment}
              onChange={event => {
                setComment(event.target.value);
              }}
            />

            <input
              type="submit"
              value="Soumettre"
              css={{
                padding: '6px 12px',
                borderRadius: 6,
                background: 'hsl(200, 20%, 50%)',
                fontSize: '1em',
                color: 'white',
                border: 0,
                marginTop: 6,
              }}
            />
          </form>
        )}
      </Mutation>
    </div>
  );
};

class PostPage extends React.Component {
  static getInitialProps({ query: { slug } }) {
    return { slug };
  }
  render() {
    const { slug } = this.props;
    return (
      <Layout>
        <Header />
        <div css={{ margin: '48px 0' }}>
          <Link href="/" passHref>
            <a css={{ color: 'hsl(200,20%,50%)', cursor: 'pointer' }}>{'< Accueil'}</a>
          </Link>
          <Query query={ALL_QUERIES} variables={{ slug }}>
            {({ data, loading, error }) => {
              if (loading) return <p>loading...</p>;
              if (error) return <p>Error!</p>;

              const post = data.allPosts && data.allPosts[0];

              if (!post) return <p>404: Post not found</p>;

              if (post.image && post.image.publicUrl) {
                post.image.mediumUrl = String(post.image.publicUrl).replace('upload/', 'upload/w_864/');
              }

              return (
                <>
                  <div
                    css={{
                      background: 'white',
                      margin: '24px 0',
                      boxShadow: '0px 10px 20px hsla(200, 20%, 20%, 0.20)',
                      marginBottom: 32,
                      borderRadius: 6,
                      overflow: 'hidden',
                    }}
                  >
                    <Head>
                      <title>{post.title}</title>
                    </Head>
                    {post.image ? <img src={post.image.mediumUrl} css={{ width: '100%' }} /> : null}
                    <article css={{ padding: '1em' }}>
                      <h1 css={{ marginTop: 0 }}>{post.title}</h1>
                      <section dangerouslySetInnerHTML={{ __html: post.body }} />
                      {post.showPostedBy ? 
                      <div css={{ marginTop: '1em', borderTop: '1px solid hsl(200, 20%, 80%)' }}>
                        <p css={{ fontSize: '0.8em', marginBottom: 0, color: 'hsl(200, 20%, 50%)' }}>
                          Posté par {post.author ? post.author.name : 'Quelqu\'un'} le{' '}
                          {format(post.posted, 'DD/MM/YYYY')}
                        </p>
                      </div> : null}
                    </article>
                  </div>

                  <Comments data={data} />

                  <AddComments post={post} users={data.allUsers} />
                </>
              );
            }}
          </Query>
        </div>
      </Layout>
    );
  }
}

export default PostPage;
