<template>
    <section class="flex flex-col items-center" :class="props.class">
        <template v-if="feedData.length">
            <div
                v-for="post in feedData"
                :id="`post-${getPostId(post.uri)}`"
                class="w-full"
            >
                <BSkyPost
                    :post="post"
                    :modal-content-handler="handleModalContent"
                    :compact="props.compact"
                />
            </div>

            <teleport :to="props.attach ?? 'body'">
                <Transition
                    enter-active-class="transition-all duration-500"
                    leave-active-class="transition-all duration-500"
                    enter-from-class="opacity-0"
                    leave-to-class="opacity-0"
                    @after-leave="onModalLeave"
                >
                    <div
                        v-show="showModal"
                        class="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center"
                        :class="props.modalBackdropClass"
                    >
                        <header class="absolute top-5 right-5">
                            <button
                                type="button"
                                class="flex items-center justify-center"
                                :class="props.modalCloseButtonClass"
                                aria-label="close"
                                @click="showModal = false"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="size-6"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M6 18 18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </header>
                        <div :class="props.modalClass">
                            <img
                                ref="modalImageRef"
                                src=""
                                alt=""
                                class="max-h-[90vh]"
                            />
                        </div>
                    </div>
                </Transition>
            </teleport>

            <div v-if="props.loadMore && cursor" class="mt-8 mb-16">
                <button
                    id="bsky-load-more"
                    :class="props.loadMoreClass"
                    @click="loadMore"
                >
                    Load More Posts
                </button>
            </div>
        </template>
        <BSkyLoading v-if="isLoading" :limit="limit" />
    </section>
</template>

<script setup lang="ts">
import { ref, provide, computed, type ComputedRef } from "vue";
import { useBlueskyData } from "./composables/useBlueskyData";
import BSkyPost from "./components/BSkyPost.vue";
import BSkyLoading from "./components/BSkyLoading.vue";
import { Props, RootProps } from "./types";
import { blueskyFeedKey } from "./lib/utils";

const props = withDefaults(defineProps<Props>(), {
    class: "max-w-screen-sm mx-auto",
    postClass: "p-4 border-b text-start border-slate-300 dark:border-slate-800",
    postHeaderClass: "flex max-w-[calc(100vw-96px)] items-center",
    postUserLinkClass:
        "text-ellipsis overflow-hidden whitespace-nowrap hover:underline dark:text-white",
    postUsernameClass: "font-bold dark:text-white",
    postUserHandleClass: "text-slate-500 dark:text-slate-400 text-sm",
    postTimestampClass: "text-slate-500 dark:text-slate-400 text-sm",
    postAvatarClass: "size-14 rounded-full",
    postVideoClass: "rounded-md w-full h-full object-cover",
    postCardAvatarClass: "size-4 mr-1 rounded-full",
    postTextContentClass: "whitespace-pre-wrap dark:text-white",
    postCardClass: "rounded-md border border-slate-300",
    postCardThumbnailClass: "rounded-t-md",
    postCardHostClass: "text-slate-500 dark:text-slate-400 text-sm",
    postCardTitleClass: "font-bold dark:text-white mb-1",
    postCardDescriptionClass: "whitespace-pre-wrap dark:text-white",
    postReplyClass: "rounded-md border border-slate-300",
    postImageGridClass: "grid grid-cols-2 gap-2",
    repostClass:
        "flex gap-1 items-center ml-10 text-slate-600 dark:text-slate-400",
    repostTextClass: "text-sm text-slate-500 font-semibold",
    compactToggleClass: "text-sm text-right",
    loadMoreClass:
        "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
    loadingPostClass:
        "w-full flex gap-2 p-4 border-b border-slate-300 dark:border-slate-800 animate-pulse",
    loadingPostAvatarClass:
        "bg-slate-200 w-14 h-14 rounded-full dark:bg-slate-800",
    loadingPostHeadlineClass:
        "h-2 bg-slate-200 rounded col-span-2 dark:bg-slate-800",
    loadingPostLines: 3,
    loadingPostLineClass: "h-2 bg-slate-200 rounded dark:bg-slate-800",
    modalBackdropClass: "bg-zinc-800/80 backdrop-blur",
    modalCloseButtonClass: "bg-gray-900 rounded-full w-10 h-10 text-white",
    modalClass: "",
    linkClass: "text-blue-500 underline",
});
const { feedData, isLoading, limit, cursor, loadMore } = useBlueskyData(props);

const modalImageRef = ref();

const getPostId = (uri: string) => {
    const parts = uri.split("/");
    return parts.pop();
};

const showModal = ref(false);

const handleModalContent = (
    e: Event,
    image: { fullsize: string; alt: string }
): void => {
    if (!props.linkImage && modalImageRef.value) {
        e.preventDefault();
        modalImageRef.value.src = image.fullsize;
        modalImageRef.value.alt = image.alt;
        showModal.value = true;
    }
};

const onModalLeave = () => {
    if (!showModal.value) {
        modalImageRef.value.src = null;
        modalImageRef.value.alt = null;
    }
};

provide(
    blueskyFeedKey,
    computed(
        () =>
            [
                "compactToggleClass",
                "postClass",
                "postAvatarClass",
                "postHeaderClass",
                "postUserLinkClass",
                "postUsernameClass",
                "postUserHandleClass",
                "postTimestampClass",
                "postVideoClass",
                "postCardAvatarClass",
                "postTextContentClass",
                "postCardClass",
                "postCardThumbnailClass",
                "postCardHostClass",
                "postCardTitleClass",
                "postCardDescriptionClass",
                "postReplyClass",
                "postImageGridClass",
                "repostClass",
                "repostTextClass",
                "loadingPostClass",
                "loadingPostAvatarClass",
                "loadingPostHeadlineClass",
                "loadingPostLines",
                "loadingPostLineClass",
            ].reduce((acc, curr) => {
                acc[curr] = props[curr];
                return acc;
            }, {}) as RootProps
    )
);
</script>
