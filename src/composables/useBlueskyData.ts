import { ref, computed, type Ref } from "vue";
import type { Props, BlueskyPost } from "../types";
import { agent } from "../lib/api";
import { formatData } from "../lib/utils";

export const useBlueskyData = (
    props: Pick<Props, "username" | "feed" | "search" | "limit" | "linkClass">
) => {
    const isLoading = ref(false);
    const feedData: Ref<BlueskyPost[]> = ref([]);
    const cursor = ref("");
    const limit = computed(() => props.limit ?? 25);

    const loadFeed = (newData: any[]) => {
        const updatedFeed = [...feedData.value, ...newData];
        feedData.value = updatedFeed;
    };

    const loadMore = () => {
        updateFeed(cursor.value);
    };

    const updateFeed = async (c?: string) => {
        isLoading.value = true;

        if (props.username) {
            const { success, data } = await agent.app.bsky.feed.getAuthorFeed({
                limit: limit.value,
                actor: props.username,
                filter: "posts_no_replies",
                cursor: cursor.value,
            });
            //await new Promise((resolve) => setTimeout(resolve, 60000));
            if (success) {
                const feed = formatData(data, props);
                cursor.value = data.cursor ?? "";
                loadFeed(feed);
            } else {
                console.error(
                    `[Vue Bluesky Feed] Error loading feed for username "${props.username}"`
                );
            }
            isLoading.value = false;
        } else if (props.feed) {
            const { success, data } = await agent.app.bsky.feed.getFeed({
                limit: limit.value,
                feed: props.feed,
                cursor: cursor.value,
            });
            if (success) {
                const feed = formatData(data, props);
                cursor.value = data.cursor ?? "";
                loadFeed(feed);
            } else {
                console.error(
                    `[Vue Bluesky Feed] Error loading feed for "${props.feed}"`
                );
            }
            isLoading.value = false;
        } else if (props.search) {
            const { success, data } = await agent.app.bsky.feed.searchPosts({
                limit: limit.value,
                q: props.search,
                cursor: cursor.value,
            });
            if (success) {
                const mappedData = {
                    ...data,
                    feed: data.posts.map((p) => ({ post: p })),
                };
                const feed = formatData(mappedData, props);
                loadFeed(feed);
                cursor.value = data.cursor ?? "";
            } else {
                console.error(
                    `[Vue Bluesky Feed] Error loading feed for search term "${props.search}"`
                );
            }
            isLoading.value = false;
        } else {
            isLoading.value = false;
            console.error(
                "[Vue Bluesky Feed] No valid feed found. Please pass a valid 'feed', 'username', or 'search' prop"
            );
        }
    };
    updateFeed();

    return {
        cursor,
        isLoading,
        feedData,
        updateFeed,
        limit,
        loadMore,
    };
};
