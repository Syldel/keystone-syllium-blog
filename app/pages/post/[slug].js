import Head from 'next/head';

import gql from 'graphql-tag';
import React from 'react';
import { Mutation, Query } from 'react-apollo';
import { useState } from 'react';

import { jsx } from '@emotion/core';
import { format } from 'date-fns';

import Layout from '../../templates/layout';
import Header from '../../components/header';
import Loading from '../../components/loading';
//import BackButton from '../../components/back-button';

/** @jsx jsx */

const ADD_COMMENT = gql`
  mutation AddComment($body: String!, $pseudo: String!, $postId: ID!, $posted: DateTime!) {
    createComment(
      data: {
        body: $body
        pseudo: $pseudo
        originalPost: { connect: { id: $postId } }
        posted: $posted
      }
    ) {
      id
      body
      pseudo
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
        avatar {
          publicUrl
        }
      }
    }

    allComments(where: { originalPost: { slug: $slug } }) {
      id
      body
      pseudo
      posted
    }

    allSettings (
      where: {key: "showPostDetailPostedBy"}
    ) {
      key
      value
    }

    allNavItems (
      where: {published: true}
    ) {
      id
      name
      href
      target
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
              src={comment.pseudo
                ? imagePlaceholder(comment.pseudo)
                : imagePlaceholder('')}
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
                {comment.pseudo} le {format(comment.posted, 'DD MMM YYYY')}
              </p>
              <p css={{ margin: '8px 0' }}>{comment.body}</p>
            </div>
          </div>
        ))
      : 'No comments yet'}
  </div>
);

const AddComments = ({ post }) => {
  let [comment, setComment] = useState('');
  let [pseudo, setPseudo] = useState('');

  return (
    <div>
      <h2>Ajouter un nouveau commentaire</h2>
      <Mutation
        mutation={ADD_COMMENT}
        update={(cache, { data: data }) => {
          const { allComments, allPosts } = cache.readQuery({
            query: ALL_QUERIES,
            variables: { slug: post.slug },
          });

          cache.writeQuery({
            query: ALL_QUERIES,
            variables: { slug: post.slug },
            data: {
              allPosts,
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
                  pseudo: pseudo,
                  postId: post.id,
                  posted: new Date(),
                },
              });

              setComment('');
              setPseudo('');
            }}
          >
            <input
              type="text"
              placeholder="Votre pseudo"
              name="pseudo"
              css={{
                padding: 12,
                fontSize: 16,
                height: 40,
                border: 0,
                borderRadius: 6,
                resize: 'none',
              }}
              className="col-sm-4"
              value={pseudo}
              onChange={event => {
                setPseudo(event.target.value);
              }}
            />

            <textarea
              type="text"
              placeholder="Votre commentaire"
              name="comment"
              css={{
                padding: 12,
                fontSize: 16,
                width: '100%',
                height: 80,
                border: 0,
                borderRadius: 6,
                resize: 'none',
                marginTop: 12,
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

let showPostDetailPostedBy = true;

class PostPage extends React.Component {
  static getInitialProps({ query: { slug } }) {
    return { slug };
  }

  constructor(props) {
    super(props);
    this.state = {
      ssrDone: false
    };
  }

  componentDidMount() {
    this.currentWindowLocation = window.location;
    this.setState({ ssrDone: true });
  }

  render() {
    if (!this.state.ssrDone) {
      return <Loading />;
    }

    const { slug } = this.props;
    return (
      <Layout>
        <Query query={ALL_QUERIES} variables={{ slug }}>
          {({ data, loading, error }) => {
            if (loading) return <Loading />;
            if (error) return <p>Error!</p>;

            const post = data && data.allPosts && data.allPosts[0];

            if (!post) return <p>404: Post not found</p>;

            if (post.image && post.image.publicUrl) {
              post.image.mediumUrl = String(post.image.publicUrl).replace('upload/', 'upload/w_864,q_60/');
            }

            if (post.author && post.author.avatar && post.author.avatar.publicUrl) {
              post.author.avatar.thumbnailUrl = String(post.author.avatar.publicUrl).replace('upload/', 'upload/w_80,c_fill,ar_1:1,g_auto,r_max,q_60/');
            }

            if (data.allSettings) {
              const settingsFiltered = data.allSettings.filter(k => k.key === 'showPostDetailPostedBy')[0];
              if (settingsFiltered) {
                showPostDetailPostedBy = (settingsFiltered.value === 'true' || settingsFiltered.value === true);
              }
            }

            let metaDescription = post.intro || post.body;
            metaDescription = metaDescription.replace(/<\/?[^>]+(>|$)/g, '');
            metaDescription = metaDescription.substring(0, 160);

            return (
              <>
                <Header data={data.allNavItems} />
                <div css={{ margin: '48px 0' }}>
                  {/* <BackButton href="/" color="hsl(200,20%,50%)" className="mb-3">Accueil</BackButton> */}
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
                      <meta name="description" content={metaDescription} />
                      <meta property="og:title" content={post.title} />
                      <meta property="og:type" content="article" />
                      <meta property="og:url" content={this.currentWindowLocation.href} />
                      <meta property="og:image" content={post.image ? post.image.mediumUrl : ''} />
                      <meta property="og:description" content={metaDescription} />
                    </Head>
                    {post.image ? <img src={post.image.mediumUrl} css={{ width: '100%' }} /> : null}
                    <article css={{ padding: '1em' }}>
                      <h1 css={{ marginTop: 0 }}>{post.title}</h1>
                      <section dangerouslySetInnerHTML={{ __html: post.intro }} />
                      <section dangerouslySetInnerHTML={{ __html: post.body }} />
                      {showPostDetailPostedBy ? 
                      <div css={{ marginTop: '1em', borderTop: '1px solid hsl(200, 20%, 80%)', display: 'flex', alignItems: 'center', paddingTop: '1rem' }}>
                        {post.author.avatar.thumbnailUrl
                          ? <img src={post.author.avatar.thumbnailUrl} css={{ width: '80px' }} />
                          : <img src={post.author.name
                                ? imagePlaceholder(post.author.name)
                                : imagePlaceholder('')}
                              css={{ width: 80, height: 80, borderRadius: 40 }}
                            />
                          }
                        <p css={{ fontSize: '1em', marginBottom: 0, marginLeft: '1rem', color: 'hsl(200, 20%, 50%)' }}>
                          Posté par {post.author ? post.author.name : 'Quelqu\'un'} le{' '}
                          {format(post.posted, 'DD/MM/YYYY')}
                        </p>
                      </div> : null}
                    </article>
                  </div>

                  <Comments data={data} />

                  <AddComments post={post} />
                </div>
              </>
            );
          }}
        </Query>
      </Layout>
    );
  }
}

export default PostPage;
