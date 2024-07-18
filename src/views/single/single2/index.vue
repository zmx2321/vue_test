<template>
  <section>
    <upload-tool @verifyFileType="verifyFileType" @getFile="getFile">
      <template #tip>
        <span>请上传xls或者xlsx格式</span>
      </template>
    </upload-tool>

    <div class="detail_wrap">
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import * as XLSX from 'xlsx';

const excelResData = ref([])

const verifyFileType = (file, next) => {
  if (!/\.(xls|xlsx)$/.test(file.name.toLowerCase())) {
    ElMessage({
      message: "上传格式不正确，请上传xls或者xlsx格式！",
      type: "error",
    });
    next(false)
    return
  }
  next(true)
}

const getFile = async (file) => {
  console.log(file)
};

</script>

<style lang="scss" scoped>
.detail_wrap {
  padding: 20px;
  width: 95%;
  height: 80vh;
  border: solid 1px #ccc;
  margin: 0 auto;
  overflow: auto;
}
</style>
