export interface RootProps {
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
    loadingPostLineClass: string;
    loadingPostLines: number;
}

export interface Props extends RootProps {
    class: string;
    username?: string;
    feed?: string;
    search?: string;
    limit?: number;
    linkTarget?: "_self" | "_blank" | "_parent" | "_top";
    linkImage?: boolean;
    customStyles?: string;
    loadMore?: boolean;
    attach?: HTMLElement;
    compact: boolean;
    loadMoreClass: string;
    modalBackdropClass: string;
    modalCloseButtonClass: string;
    modalClass: string;
    linkClass: string;
}

export interface BlueskyImageElement {
    alt: string;
    aspectRatio: {
        height: number;
        width: number;
    };
    fullsize: string;
    thumb: string;
}

export interface BlueskyTextElement {
    setInnerHtml: boolean;
    val: string;
}

export interface BlueskyVideoElement {
    thumbnail: string;
}

export interface BlueskyCardElement {
    uri: string;
    thumb?: string;
    title: string;
    description: string;
}

export interface BlueskyPost {
    avatar: string;
    card: false | BlueskyCardElement;
    createdAt: string;
    handle: string;
    images: BlueskyImageElement[];
    isRepost: boolean;
    replyPost: false | BlueskyPost;
    repostBy?: string;
    text?: BlueskyTextElement[];
    uri: string;
    username: string;
    video: false | BlueskyVideoElement;
}
