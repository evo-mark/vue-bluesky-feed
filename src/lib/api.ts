import { AtpAgent } from "@atproto/api/src/index";

export const agent: AtpAgent = new AtpAgent({
	service: "https://api.bsky.app",
});
