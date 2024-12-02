<p align="center">
    <a href="https://evomark.co.uk" target="_blank" alt="Link to evoMark's website">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="https://evomark.co.uk/wp-content/uploads/static/evomark-logo--dark.svg">
          <source media="(prefers-color-scheme: light)" srcset="https://evomark.co.uk/wp-content/uploads/static/evomark-logo--light.svg">
          <img alt="evoMark company logo" src="https://evomark.co.uk/wp-content/uploads/static/evomark-logo--light.svg" width="500">
        </picture>
    </a>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/dm/@evomark/vue-bluesky-feed.svg" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/@evomark/vue-bluesky-feed"><img src="https://img.shields.io/npm/v/@evomark/vue-bluesky-feed.svg" alt="Version"></a>
  <a href="https://github.com/evo-mark/vue-bluesky-feed/blob/main/LICENCE"><img src="https://img.shields.io/github/license/evo-mark/vue-bluesky-feed?style=flat" alt="Licence"></a>
</p>

# Vue Bluesky Feed by evoMark

A Vue3 / Tailwind component for showing Bluesky feeds, sourced from either usernames, search terms or general feeds.

## Install

### NPM

```shell
npm install @evomark/vue-bluesky-feed
```

### Yarn

```shell
yarn add @evomark/vue-bluesky-feed
```

### PNPM

```shell
pnpm add @evomark/vue-bluesky-feed
```

## Requirements

- Vue 3.5+
- Tailwind
- NodeJS 20+

## Setup

### tailwind.config.js

```js
import blueskyTailwind from "@evomark/vue-bluesky-feed/tailwind";

export default {
  content: [...blueskyTailwind()],
  // ...
};
```

### Vue Component

```js
import { VueBlueskyFeed } from "@evomark/vue-bluesky-feed";
```

```html
<template>
  <VueBlueskyFeed
    username="evanyou.me"
    limit="5"
    load-more
    link-class="underline text-red-600"
    post-avatar-class="size-14 rounded"
  />
</template>
```

## Usage

Full documentation coming soon, for now, here's the prop types

```ts
interface ComponentProps {
  // Generate a feed from a username
  username?: string;
  // Generate a feed by name
  feed?: string;
  // Generate a feed from a search term
  search?: string;
  // Max no. of feed posts per request
  limit?: number;
  linkTarget?: "_self" | "_blank" | "_parent" | "_top";
  // Link to images rather than showing in modal
  linkImage?: boolean;

  // Render a button to load more posts
  loadMore?: boolean;
  // Element to attach the modal to
  attach?: HTMLElement;
  // Use compact mode, where additional content is hidden initially
  compact: boolean;

  class: string;
  loadMoreClass: string;
  modalBackdropClass: string;
  modalCloseButtonClass: string;
  modalClass: string;
  linkClass: string;

  compactToggleClass: string;
  postClass: string;
  postHeaderClass: string;
  postUserLinkClass: string;
  postUsernameClass: string;
  postUserHandleClass: string;
  postTimestampClass: string;
  postAvatarClass: string;
  postVideoClass: string;
  postCardAvatarClass: string;
  postTextContentClass: string;
  postCardClass: string;
  postCardThumbnailClass: string;
  postCardHostClass: string;
  postCardTitleClass: string;
  postCardDescriptionClass: string;
  postReplyClass: string;
  postImageGridClass: string;
  repostClass: string;
  repostTextClass: string;

  loadingPostClass: string;
  loadingPostAvatarClass: string;
  loadingPostHeadlineClass: string;
  // Class for each line of the post when loading
  loadingPostLineClass: string;
  // Number of lines to represent the post in a loading skeleton
  loadingPostLines: number;
}
```


## Roadmap

- The bundle size is currently too large due to @atproto/api dependencies, investigate ways to reduce
- Provide a build package with Tailwind class already included, making it optional in the consuming app
