<template>
    <el-upload class="upload_wrap" multiple :limit="limitNum" :file-list="fileList" :auto-upload="false"
        :before-remove="beforeRemove" :on-exceed="handleExceed" :on-preview="handlePreview" :on-change="changeFile">
        <el-button>点击上传</el-button>
        <template #tip>
            <div class="el-upload__tip">
                <slot name="tip"></slot>
            </div>
        </template>
    </el-upload>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';
import { ElMessage } from 'element-plus';

// poxy对象
const { proxy } = getCurrentInstance();

// 子组件自定义事件
const emit = defineEmits(['verifyFileType', 'getFile'])

const fileList = ref([])
const limitNum = ref(1)

// 删除文件之前的钩子
const beforeRemove = (file) => {
    return proxy.$modal.confirm(
        `确定移除 ${file.name} ?`
    ).then(
        () => true,
        () => false
    )
}

// 限制提示
const handleExceed = () => {
    ElMessage.warning(`当前限制选择 ${limitNum.value} 个文件`)
}

// 点击文件
const handlePreview = file => {
    console.log("点击文件", file)
}

// 校验文件类型
const verifyFileType = (file, next) => {
    emit('verifyFileType', file, flag => {
        if (!flag) {
            fileList.value = fileList.value.pop()
        }

        next(flag)
    })
}

// 文件改变后触发
const changeFile = file => {
    let flag = verifyFileType(file, flag => {
        if (flag) {
            emit('getFile', file)
        }
    })
}
</script>

<style lang="scss" scoped>
.upload_wrap {
    width: 275px;

    :deep .el-upload-list {
        max-height: 100px;
        overflow-y: auto;
    }
}
</style>