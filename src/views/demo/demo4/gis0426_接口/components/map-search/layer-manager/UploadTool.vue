<template>
    <el-upload class="upload_wrap" drag multiple :limit="limitNum" :file-list="fileList" :auto-upload="false"
        :before-remove="beforeRemove" :on-exceed="handleExceed" :on-preview="handlePreview" :on-change="changeFile">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
            拖拽文件或者<em>点击上传</em>
        </div>
        <template #tip>
            <div class="el-upload__tip">
                kml files with a size less than 50M
            </div>
        </template>
    </el-upload>
</template>

<script setup>
import { ref } from 'vue';
// 组件传参
import mittBus from '@/utils/mittBus' // mitt

/* // store
import { gisDataStore } from '@/store/modules/gis.js'
const gisStoreData = gisDataStore()
const { setKmlTempFile } = gisDataStore() // store */

// poxy对象
const { proxy } = getCurrentInstance();

// 子组件自定义事件
const emit = defineEmits(['getFile'])

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
const handleExceed = (file) => {
    proxy.$modal.alert(`文件超出上限`);
}

// 点击文件
const handlePreview = (file) => {
    // console.log("点击文件", file)

    /* setKmlTempFile([file.raw])
    console.log(gisStoreData.kmlTempFile) */

    mittBus.emit('addTestKmlFile', file)


    /* const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        console.log(text)

        mittBus.emit('loadKML', text)
    };
    reader.readAsText(file.raw); */

    /*  const reader = new FileReader();
     reader.onload = (e) => {
         const text = e.target.result;
 
         mittBus.emit('loadKML', text)
     }; */

    // console.log("获取文件流加载kml", event.target.files[0])
    /* const file = event.target.files[0];
    if (!file) {
      return;
    }
  
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
  
      mittBus.emit('loadKML', text)
    };
    reader.readAsText(file); */

    /* console.log("获取文件流加载kml", file)
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        console.log(text)

    }; */
    // reader.readAsText(file);
}

// 文件改变后触发
const changeFile = (file) => {
    // console.log("文件改变后触发", file, file.raw)

    emit('getFile', file)
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