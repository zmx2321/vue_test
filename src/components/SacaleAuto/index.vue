<template>
    <section class="container">
        <!-- 大屏展示区 -->
        <div class="scale_box" :style="{ width: width + 'px', height: height + 'px' }">
            <slot></slot>
        </div>
    </section>
</template>

<script setup name="ScaleBox">
import { onMounted, ref, watch, onUnmounted } from "vue";
import { debounce } from '@/utils/index.js'

/** props 参数 */
const props = defineProps({
    width: {
        type: Number,
        default: 1920
    },
    height: {
        type: Number,
        default: 1080
    },
});
/** 公共数据 */
const width = ref(props.width)
const height = ref(props.height)
let scale = ref({
    w: 1,
    h: 1,
});

/**
 * 业务方法
 */
const getScale = () => {
    const w = window.innerWidth / width.value;
    const h = window.innerHeight / height.value;
    let myScale = w < h ? w : h;
    return [myScale, myScale];
};
const setScale = () => {
    // 缩放比
    scale.value.h = getScale()[0];
    scale.value.w = getScale()[1];
};
let reCalc = debounce(setScale);

/** 监听 */
watch(
    () => width.value,
    () => {
        setScale();
    }
);

/** 生命周期 */
onMounted(() => {
    setScale();
    window.addEventListener("resize", reCalc);
});
onUnmounted(() => {
    window.removeEventListener("resize", reCalc);
});
</script>

<style lang="scss" scoped>
.container {
    width: 100vw;
    height: 100vh;
    background: rgba(255, 0, 0, 0.3);
    background-size: cover;

    .scale_box {
        position: fixed;
        transform: scale(v-bind('scale.h')) translate(-50%, -50%);
        transform: scale(v-bind("scale.w"), v-bind("scale.h")) translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        transform-origin: top left;
        left: 50%;
        top: 50%;
        transition: 0.2s;
        z-index: 999;
        background: #c8f8e3;
    }
}
</style>