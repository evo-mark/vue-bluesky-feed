<template>
	<article :class="rootProps.postClass">
		<p v-if="post.isRepost" :class="rootProps.repostClass">
			<svg viewBox="0 0 576 512" height="16" width="16" tabindex="-1" class="mr-1">
				<path
					fill="currentColor"
					d="M272 416c17.7 0 32-14.3 32-32s-14.3-32-32-32H160c-17.7 0-32-14.3-32-32V192h32c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-64-64c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8l32 0 0 128c0 53 43 96 96 96H272zM304 96c-17.7 0-32 14.3-32 32s14.3 32 32 32l112 0c17.7 0 32 14.3 32 32l0 128H416c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8l-32 0V192c0-53-43-96-96-96L304 96z"
				></path>
			</svg>
			<span :class="rootProps.repostTextClass">Reposted by {{ post.repostBy }}</span>
		</p>

		<div class="flex gap-2">
			<img v-if="!isCard" :src="post.avatar" alt="profile picture" :class="rootProps.postAvatarClass" />
			<div class="w-full">
				<header :class="rootProps.postHeaderClass">
					<img
						v-if="isCard"
						:src="post.avatar"
						alt="profile picture"
						:class="rootProps.postCardAvatarClass"
					/>
					<a
						:href="`https://bsky.app/profile/${post.handle}`"
						:class="rootProps.postUserLinkClass"
						:target="linkTarget"
						:rel="linkTarget === '_blank' ? 'noopeener' : ''"
					>
						<span :class="rootProps.postUsernameClass" v-text="post.username" />
						<span>&nbsp;</span>
						<span :class="rootProps.postUserHandleClass" v-text="`@${post.handle}`" />
					</a>
					<span :class="rootProps.postTimestampClass">
						<span class="mx-1">·</span>
						<a
							:href="`https://bsky.app/profile/${post.handle}/post/${getContentAfterLastSlash(post.uri)}`"
							class="hover:underline"
							:target="linkTarget"
							:rel="linkTarget === '_blank' ? 'noopeener' : ''"
						>
							{{ timeDifference(new Date(post.createdAt)) }}
						</a>
					</span>
				</header>

				<p :class="rootProps.postTextContentClass">
					<template v-for="(textEl, index) in post.text" :key="`text-${index}`">
						<span v-if="textEl.setInnerHtml" v-html="textEl.val"></span>
						<span v-else v-text="textEl.val" />
					</template>
				</p>

				<template v-if="post.images?.length">
					<ToggleShow v-if="compact" :show="showImageGrid" @toggle="showImageGrid = !showImageGrid">
						{{ post.images?.length !== 1 ? "Images" : "Image" }}
					</ToggleShow>
					<Vue3SlideUpDown v-model="showImageGrid">
						<div
							:class="{
								'mt-4': post.images.length === 1,
								['mt-4 ' + rootProps.postImageGridClass]: post.images.length > 1,
							}"
						>
							<a
								v-for="image in post.images"
								:key="image.thumb"
								:href="`https://bsky.app/profile/${
									post.handle
								}/post/${getContentAfterLastSlash(post.uri)}`"
								:target="linkTarget"
								:rel="linkTarget === '_blank' ? 'noopeener' : ''"
								@click="($event) => modalContentHandler($event, image)"
							>
								<img :src="image.thumb" :alt="image.alt" class="rounded-md" />
							</a>
						</div>
					</Vue3SlideUpDown>
				</template>

				<div v-if="post.video" class="mt-4 w-full">
					<video
						ref="videoRef"
						width="100%"
						:poster="post.video.thumbnail"
						:class="rootProps.postVideoClass"
						preload="none"
						controls
						muted
					></video>
				</div>

				<template v-if="post.card">
					<ToggleShow v-if="compact" :show="showPostCard" @toggle="showPostCard = !showPostCard">
						Card
					</ToggleShow>
					<Vue3SlideUpDown v-model="showPostCard">
						<a
							:href="post.card.uri"
							target="_blank"
							rel="noopener"
							class="vue-bluesky-feed__post-card mt-4 block"
							:class="rootProps.postCardClass"
						>
							<img
								v-if="post.card.thumb"
								:src="post.card.thumb"
								:class="rootProps.postCardThumbnailClass"
								alt="Post Thumbnail"
							/>
							<div class="p-3">
								<p :class="rootProps.postCardHostClass">
									{{ cardHostname }}
								</p>
								<p :class="rootProps.postCardTitleClass">
									{{ post.card.title }}
								</p>
								<p :class="rootProps.postCardDescriptionClass">
									{{ post.card.description }}
								</p>
							</div>
						</a>
					</Vue3SlideUpDown>
				</template>

				<template v-if="post.replyPost">
					<ToggleShow v-if="compact" :show="showReply" @toggle="showReply = !showReply">
						Replied Post
					</ToggleShow>
					<Vue3SlideUpDown v-model="showReply">
						<a
							:href="`https://bsky.app/profile/${post.replyPost.handle}/post/${getContentAfterLastSlash(post.replyPost.uri)}`"
							target="_blank"
							rel="noopener"
							class="vue-bluesky-feed__reply-post mt-4 block"
							:class="rootProps.postReplyClass"
						>
							<BSkyPost
								v-bind="{
									linkTarget,
									modalContentHandler,
									compact,
								}"
								:post="post.replyPost"
								is-card
							/>
						</a>
					</Vue3SlideUpDown>
				</template>
			</div>
		</div>
	</article>
</template>

<script setup lang="ts">
import { getContentAfterLastSlash, timeDifference, fetchVideo } from "../lib/utils";
import ToggleShow from "./ToggleShow.vue";
import { Vue3SlideUpDown } from "vue3-slide-up-down";
import type { BlueskyImageElement, BlueskyPost } from "../types";
import { ref, computed, onMounted, inject } from "vue";
import { blueskyFeedKey } from "../lib/utils";

defineOptions({
	name: "BSkyPost",
});

interface Props {
	post: BlueskyPost;
	isCard?: boolean;
	linkTarget?: "_self" | "_blank" | "_parent" | "_top";
	modalContentHandler: (e: Event, image: BlueskyImageElement) => void;
	compact: boolean;
}

const { post, isCard = false, linkTarget = "_blank", modalContentHandler, compact = false } = defineProps<Props>();
const rootProps = inject(blueskyFeedKey)!;

const videoRef = ref();
const showPostCard = ref(!compact);
const showReply = ref(!compact);
const showImageGrid = ref(!compact);

const cardHostname = computed(() => {
	if (!post?.card || typeof post.card !== "object") return "";
	else return new URL(post.card.uri)?.hostname ?? "";
});

onMounted(() => {
	if (post.video && post.video.cid) {
		fetchVideo(post.video, videoRef);
	}
});
</script>
