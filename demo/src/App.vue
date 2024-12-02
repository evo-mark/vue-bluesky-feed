<template>
	<VueBlueskyFeed
		username="jlalibs.bsky.social"
		limit="5"
		load-more
		compact
		link-class="underline text-red-600"
		post-avatar-class="size-14 rounded"
	/>
</template>

<script setup>
import { VueBlueskyFeed } from "@evomark/vue-bluesky-feed";
</script>
