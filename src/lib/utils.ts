import { RichText } from "@atproto/api/src/index";
/** @ts-expect-error Library issue that shouldn't affect anything */
import Hls from "hls.js/dist/hls.light.min.js";
import type { InjectionKey, Ref, ComputedRef } from "vue";
import type { Props, RootProps } from "../types";

export const blueskyFeedKey = Symbol.for("bluesky-feed") as InjectionKey<ComputedRef<RootProps>>;

export interface Text {
	val: string;
	setInnerHtml: boolean;
}

interface Reason {
	$type: string;
	by: {
		displayName: string;
	};
}

const formatPost: ({
	post,
	reason,
	isRoot,
	props,
}: {
	post: any;
	reason: Reason;
	isRoot: boolean;
	props: Pick<Props, "username" | "feed" | "search" | "limit" | "linkClass">;
}) => {
	createdAt: string;
	images: any[];
	isRepost: boolean;
	repostBy: string | null | undefined;
	handle: string;
	avatar: string;
	text: Text[];
	uri: string;
	card: any;
	replyPost: any;
	username: string;
} = ({ post, reason, isRoot, props }) => {
	if (post.$type === "app.bsky.graph.defs#listView") {
		// Handle list view
		return {
			username: post.creator.displayName,
			handle: post.creator.handle,
			avatar: post.creator.avatar,
			text: [{ val: post.description, setInnerHtml: false }],
			createdAt: post.indexedAt,
			uri: post.uri,
			images: [],
			card: null,
			replyPost: null,
			isRepost: false,
			repostBy: null,
		};
	}

	// Existing post handling code
	const facets = post.record.facets || [];
	const rawText = post.record.text;

	const rt: RichText = new RichText({ text: rawText, facets });
	const text: Text[] = [];

	for (const segment of rt.segments()) {
		console.log(segment);
		if (segment.isLink()) {
			text.push({
				val: `<a href="${segment.link?.uri}" target="_blank" rel="noopener" class="${props.linkClass}">${segment.text}</a>`,
				setInnerHtml: true,
			});
		} else if (segment.isMention()) {
			text.push({
				val: `<a href="https://bsky.app/profile/${segment.mention?.did}" target="_blank" rel="noopener" class="${props.linkClass}">${segment.text}</a>`,
				setInnerHtml: true,
			});
		} else if (segment.isTag()) {
			text.push({
				val: `<a href="https://bsky.app/hashtag/${segment.tag?.tag}" target="_blank" rel="noopener" class="${props.linkClass}">${segment.text}</a>`,
				setInnerHtml: true,
			});
		} else {
			text.push({
				val: segment.text,
				setInnerHtml: false,
			});
		}
	}

	const replyPost =
		post.embed?.$type === "app.bsky.embed.record#view"
			? post.embed.record
			: post.embed?.record?.record?.$type === "app.bsky.embed.record#viewRecord" && post.embed.record.record;
	const formattedReply = replyPost && {
		...replyPost,
		record: replyPost.value || replyPost.record,
		embed: (replyPost?.embeds || [])[0],
	};
	const author = post.author || post.creator;

	return {
		username: author.displayName,
		handle: author.handle,
		avatar: author.avatar, // todo fallback
		text,
		createdAt: post.record.createdAt,
		uri: post.uri,
		images: [
			...(post.embed?.images || []),
			...(post.embed?.media?.images || []),
			...[post.embed?.media?.external].filter(Boolean).map((image: any) => ({
				...image,
				alt: image.title,
				thumb: image.uri,
			})),
		],
		video: post.embed?.$type === "app.bsky.embed.video#view" && post.embed,
		card: post.embed?.$type === "app.bsky.embed.external#view" && post.embed?.external,
		replyPost:
			isRoot &&
			formattedReply &&
			formatPost({
				post: formattedReply,
				reason: { $type: "", by: { displayName: "" } },
				isRoot: false,
				props,
			}),
		isRepost: reason?.$type === "app.bsky.feed.defs#reasonRepost",
		repostBy: reason?.by?.displayName,
	};
};

export const formatData = (data: any, props: Pick<Props, "username" | "feed" | "search" | "limit" | "linkClass">) =>
	(data.feed || []).map((post: { post: any; reason: any; isRoot: any }) =>
		formatPost({ ...post, isRoot: true, props }),
	);

export const getContentAfterLastSlash = (str: string): string => {
	const lastIndex: number = str.lastIndexOf("/");

	if (lastIndex !== -1) {
		return str.substring(lastIndex + 1);
	} else {
		return str;
	}
};

export const timeDifference = (previous: Date): string => {
	const current: Date = new Date();

	const msPerMinute: number = 60 * 1000;
	const msPerHour: number = msPerMinute * 60;
	const msPerDay: number = msPerHour * 24;
	const msPerMonth: number = msPerDay * 30;
	const msPerYear: number = msPerDay * 365;

	const elapsed: number = current.getTime() - previous.getTime();

	if (elapsed < msPerMinute) {
		return Math.floor(elapsed / 1000) + "s";
	} else if (elapsed < msPerHour) {
		return Math.floor(elapsed / msPerMinute) + "m";
	} else if (elapsed < msPerDay) {
		return Math.floor(elapsed / msPerHour) + "h";
	} else if (elapsed < msPerMonth) {
		return Math.floor(elapsed / msPerDay) + "d";
	} else if (elapsed < msPerYear) {
		return Math.floor(elapsed / msPerMonth) + " mo";
	} else {
		return Math.floor(elapsed / msPerYear) + " yr";
	}
};

export const fetchVideo = async (video: any, videoRef: Ref<HTMLVideoElement>) => {
	if (!("IntersectionObserver" in window)) {
		console.error("IntersectionObserver not supported");
		return;
	}

	if (!videoRef) {
		console.error("Video element not found");
		return;
	}

	const observerOptions = {
		root: null, // Viewport is the root by default
		threshold: 0.5, // 50% of the video must be visible to trigger playback
	};

	const onIntersect = async (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
		entries.forEach((entry: IntersectionObserverEntry) => {
			if (entry.isIntersecting) {
				// Video is in view - load and play
				if (Hls.isSupported()) {
					const hls = new Hls();
					hls.loadSource(video.playlist); // Load the HLS manifest
					hls.attachMedia(videoRef.value); // Attach to video element
					hls.on(Hls.Events.MANIFEST_PARSED, () => {
						videoRef.value.play();
					});
				} else if (videoRef.value.canPlayType("application/vnd.apple.mpegurl")) {
					// Fallback for native HLS support in Safari
					videoRef.value.src = video.playlist;
					videoRef.value.addEventListener("loadedmetadata", () => {
						videoRef.value.play();
					});
				}

				// Optionally, unobserve once video starts playing if you don't need to watch for it going out of view
				observer.unobserve(videoRef.value);
			}
		});
	};

	// Create the observer
	const observer = new IntersectionObserver(onIntersect, observerOptions);
	observer.observe(videoRef.value); // Observe the video element
};
