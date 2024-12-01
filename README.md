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

# Vue Bluesky Feed

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
