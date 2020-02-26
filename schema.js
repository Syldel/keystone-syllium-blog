require('dotenv').config();
const {
  //File,
  Text,
  Slug,
  Relationship,
  Select,
  Password,
  Checkbox,
  //CalendarDay,
  DateTime,
  //OEmbed,
  CloudinaryImage,
} = require('@keystonejs/fields');
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');
const {
  //LocalFileAdapter,
  CloudinaryAdapter
} = require('@keystonejs/file-adapters');
//const getYear = require('date-fns/get_year');

//const { staticRoute, staticPath, distDir } = require('./config');
//const dev = process.env.NODE_ENV !== 'production';

// let iframelyAdapter;
// if (process.env.IFRAMELY_API_KEY) {
//   const { IframelyOEmbedAdapter } = require('@keystonejs/oembed-adapters');
//   iframelyAdapter = new IframelyOEmbedAdapter({
//     apiKey: process.env.IFRAMELY_API_KEY,
//   });
// }

//const fileAdapter = new LocalFileAdapter({
//  src: `${dev ? '' : `${distDir}/`}${staticPath}/uploads`,
//  path: `${staticRoute}/uploads`,
//});

//const avatarFileAdapter = new LocalFileAdapter({
//  src: `${staticPath}/avatars`,
//  path: `${staticRoute}/avatars`,
//});

const cloudinaryAdapter = new CloudinaryAdapter({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  apiKey: process.env.CLOUDINARY_KEY || '',
  apiSecret: process.env.CLOUDINARY_SECRET || '',
  folder: 'keystone-syllium-blog/post',
});

const avatarCloudinaryAdapter = new CloudinaryAdapter({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  apiKey: process.env.CLOUDINARY_KEY || '',
  apiSecret: process.env.CLOUDINARY_SECRET || '',
  folder: 'keystone-syllium-blog/avatar',
});

// Access control functions
const userIsAdmin = ({ authentication: { item: user } }) => Boolean(user && user.isAdmin);
const userOwnsItem = ({ authentication: { item: user } }) => {
  if (!user) {
    return false;
  }
  return { id: user.id };
};
const userIsAdminOrOwner = auth => {
  const isAdmin = access.userIsAdmin(auth);
  const isOwner = access.userOwnsItem(auth);
  return isAdmin ? isAdmin : isOwner;
};
const access = { userIsAdmin, userOwnsItem, userIsAdminOrOwner };

exports.User = {
  access: {
    read: true,
    // Only authenticated users can update their own user data. Admins can update anyone's user data.
    update: ({ existingItem, authentication }) => (
      authentication.item.isAdmin || existingItem.id === authentication.item.id
    ),
  },
  fields: {
    name: { type: Text },
    email: {
      type: Text,
      isUnique: true,
      // 2. Only authenticated users can read/update their own email, not any other user's. Admins can read/update anyone's email.
      access: ({ existingItem, authentication }) => (
        authentication.item.isAdmin || existingItem.id === authentication.item.id
      ),
    },
    //dob: {
    //  type: CalendarDay,
    //  format: 'Do MMMM YYYY',
    //  yearRangeFrom: 1901,
    //  yearRangeTo: getYear(new Date()),
    //},
    // ...(process.env.IFRAMELY_API_KEY
    //   ? {
    //       portfolio: { type: OEmbed, adapter: iframelyAdapter },
    //     }
    //   : {}),
    password: {
      type: Password,
      access: {
        // 3. Only admins can see if a password is set. No-one can read their own or other user's passwords.
        read: ({ authentication }) => authentication.item.isAdmin,
        // 4. Only authenticated users can update their own password. Admins can update anyone's password.
        update: ({ existingItem, authentication }) => (
          authentication.item.isAdmin || existingItem.id === authentication.item.id
        ),
      },
    },
    isAdmin: { type: Checkbox, defaultValue: false },
    //avatar: { type: File, adapter: avatarFileAdapter },
    avatar: { type: CloudinaryImage, adapter: avatarCloudinaryAdapter },
  },
  labelResolver: item => `${item.name} <${item.email}>`,
};

exports.Post = {
  access: {
    read: true,
    update: access.userIsAdmin,
    create: access.userIsAdmin,
    delete: access.userIsAdmin,
  },
  fields: {
    title: { type: Text },
    slug: { type: Slug, from: 'title' },
    author: {
      type: Relationship,
      ref: 'User',
    },
    categories: {
      type: Relationship,
      ref: 'PostCategory',
      many: true,
    },
    status: {
      type: Select,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    intro: { type: Wysiwyg },
    body: { type: Wysiwyg },
    posted: { type: DateTime, format: 'DD/MM/YYYY' },
    //image: { type: File, adapter: fileAdapter },
    image: { type: CloudinaryImage, adapter: cloudinaryAdapter },
  },
  adminConfig: {
    defaultPageSize: 20,
    defaultColumns: 'title, status',
    defaultSort: 'title',
  },
  labelResolver: item => item.title,
};

exports.PostCategory = {
  access: {
    read: true,
    update: access.userIsAdmin,
    create: access.userIsAdmin,
    delete: access.userIsAdmin,
  },
  fields: {
    name: { type: Text },
    slug: { type: Slug, from: 'name' },
  },
};

exports.Comment = {
  access: {
    read: true,
    update: access.userIsAdminOrOwner,
    create: true,
    delete: access.userIsAdminOrOwner,
  },
  fields: {
    body: { type: Text, isMultiline: true },
    pseudo: { type: Text, isMultiline: false },
    originalPost: {
      type: Relationship,
      ref: 'Post',
    },
    posted: { type: DateTime },
  },
  labelResolver: item => item.body,
};

exports.Setting = {
  access: {
    read: true,
    update: access.userIsAdmin,
    create: access.userIsAdmin,
    delete: access.userIsAdmin,
  },
  fields: {
    key: { type: Text },
    value: { type: Checkbox },
  },
  labelResolver: item => item.key,
};

exports.NavItem = {
  access: {
    read: true,
    update: access.userIsAdmin,
    create: access.userIsAdmin,
    delete: access.userIsAdmin,
  },
  fields: {
    name: { type: Text, isMultiline: false },
    href: { type: Text, isMultiline: false },
    target: {
      type: Select,
      defaultValue: '_self',
      options: [
        { label: '_self', value: '_self' },
        { label: '_blank', value: '_blank' },
      ],
    },
    published: { type: Checkbox, defaultValue: false },
  },
  labelResolver: item => item.name,
};