require('dotenv').config();
const {
  //File,
  Text,
  Slug,
  Relationship,
  Select,
  Password,
  Checkbox,
  CalendarDay,
  DateTime,
  //OEmbed,
  CloudinaryImage,
} = require('@keystonejs/fields');
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');
const {
  //LocalFileAdapter,
  CloudinaryAdapter
} = require('@keystonejs/file-adapters');
const getYear = require('date-fns/get_year');

const { staticRoute, staticPath, distDir } = require('./config');
const dev = process.env.NODE_ENV !== 'production';

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
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: 'keystone-syllium-blog/post',
});

const avatarCloudinaryAdapter = new CloudinaryAdapter({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: 'keystone-syllium-blog/avatar',
});

exports.User = {
  fields: {
    name: { type: Text },
    email: { type: Text, isUnique: true },
    dob: {
      type: CalendarDay,
      format: 'Do MMMM YYYY',
      yearRangeFrom: 1901,
      yearRangeTo: getYear(new Date()),
    },
    // ...(process.env.IFRAMELY_API_KEY
    //   ? {
    //       portfolio: { type: OEmbed, adapter: iframelyAdapter },
    //     }
    //   : {}),
    password: { type: Password },
    isAdmin: { type: Checkbox },
    //avatar: { type: File, adapter: avatarFileAdapter },
    avatar: { type: CloudinaryImage, adapter: avatarCloudinaryAdapter },
  },
  labelResolver: item => `${item.name} <${item.email}>`,
};

exports.Post = {
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
    showPostedBy: { type: Checkbox },
  },
  adminConfig: {
    defaultPageSize: 20,
    defaultColumns: 'title, status',
    defaultSort: 'title',
  },
  labelResolver: item => item.title,
};

exports.PostCategory = {
  fields: {
    name: { type: Text },
    slug: { type: Slug, from: 'name' },
  },
};

exports.Comment = {
  fields: {
    body: { type: Text, isMultiline: true },
    originalPost: {
      type: Relationship,
      ref: 'Post',
    },
    author: {
      type: Relationship,
      ref: 'User',
    },
    posted: { type: DateTime },
  },
  labelResolver: item => item.body,
};
