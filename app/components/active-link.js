import { withRouter } from 'next/router';
import Link from 'next/link';
import React, { Children } from 'react';

function findCommonElements(arr1, arr2) {
  return arr1.some(item => arr2.includes(item));
}

function remove(arr, item) {
  for (let i = arr.length; i--;) {
    if (arr[i] === item) {
      arr.splice(i, 1);
    }
  }
  return arr;
}

const ActiveLink = ({ router, children, ...props }) => {
  const child = Children.only(children);

  let className = child.props.className || '';

  if (props.href.indexOf('http') === -1) {
    const cleanPathnameArr = remove(router.pathname.split('/'), '');
    const cleanHrefArr = remove(props.href.split('/'), '');

    if (router.pathname === props.href && props.activeClassName) {
      className = `${className} ${props.activeClassName}`.trim();
    } else if (findCommonElements(cleanPathnameArr, cleanHrefArr) && props.activeClassName) {
      className = `${className} ${props.activeClassName}`.trim();
    }

    delete props.activeClassName;
    return <Link{...props}>{React.cloneElement(child, { className })}</Link>;
  } else {
    delete props.activeClassName;
    return React.cloneElement(child, { ...props });
  }
};

export default withRouter(ActiveLink);