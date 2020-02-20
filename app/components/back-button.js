import React from 'react';
import Link from 'next/link';

/** @jsx jsx */
import { jsx } from '@emotion/core';

class BackButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { href, color, children, className } = this.props;

    const leftChevron = color => <span css={{
      width: '20px',
      height: '20px',
      display: 'flex',
      marginRight: '0.3rem'
    }} dangerouslySetInnerHTML={{__html: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 256 256" style="width: 100%" xml:space="preserve">
<style>.svg-node{fill: ${color}}</style>
<g class="svg-node"><polygon points="207.093,30.187 176.907,0 48.907,128 176.907,256 207.093,225.813 109.28,128"/></g>
</svg>`}} />;

    const linkStyle = {
      color,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
    };

    return (
      <Link href={href} passHref>
        <a css={linkStyle} className={className}>{leftChevron(color)}{children}</a>
      </Link>
    );
  }
}

export default BackButton;