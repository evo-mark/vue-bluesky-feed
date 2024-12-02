<template>
	<article v-for="n in items" :key="`loading_${n}`" :class="rootProps.loadingPostClass">
		<div :class="rootProps.loadingPostAvatarClass"></div>
		<div class="flex-1 space-y-2 py-1">
			<div class="grid grid-cols-4 gap-4">
				<div :class="rootProps.loadingPostHeadlineClass"></div>
			</div>
			<div
				v-for="m in rootProps.loadingPostLines"
				:key="`loading-bar-${n}-${m}`"
				:class="rootProps.loadingPostLineClass"
			></div>
		</div>
	</article>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import { blueskyFeedKey } from "../lib/utils";

interface Props {
	limit: number;
}

const { limit } = defineProps<Props>();
const rootProps = inject(blueskyFeedKey)!;

const items = computed(() => +limit);
</script>
