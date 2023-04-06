<template>
    <div>
        home首页
        <div>
            <div @click="add">+</div>
            <div>{{ useAppStoreHook().num }}</div>
            <div @click="del">-</div>
        </div>
        <div @click="routerLinks">跳转about页面</div>
        <HelloWorld msg="123123" />
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useAppStoreHook } from "../../store/modules/count";
import HelloWorld from "../../components/init/HelloWorld.vue";

defineOptions({
    name: "Index",
});
const router = useRouter();
const add = async () => {
    useAppStoreHook().addNumber();
};
const del = async () => {
    useAppStoreHook().delNumber();
};

const routerLinks = async () => {
    router.push({
        name: "index-about",
    });
};
</script>
