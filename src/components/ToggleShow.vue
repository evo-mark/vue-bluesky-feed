<template>
    <div class="w-full" :class="rootProps.compactToggleClass">
        <button @click="emit('toggle')">
            <span v-if="show">Hide <slot></slot></span>
            <span v-else>Show <slot></slot></span>
        </button>
    </div>
</template>

<script setup>
import { inject } from "vue";
import { blueskyFeedKey } from "../lib/utils";

const rootProps = inject(blueskyFeedKey);

const emit = defineEmits(["toggle"]);
const { show } = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
});
</script>
