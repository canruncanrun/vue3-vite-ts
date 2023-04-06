<template>
    <RouterView v-slot="{ Component }" v-if="$route.meta.isKeepAlive">
        <KeepAlive>
            <Component :is="Component" />
        </KeepAlive>
    </RouterView>
    <RouterView v-else />
</template>
<script lang="ts" setup></script>
