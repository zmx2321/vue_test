<template>
  <el-dialog width="450px" v-model="showDialog" :close-on-click-modal="false" :modal-append-to-body="false"
    :close-on-press-escape="false">
    <template #header>
      <span>导入网格数据</span>
    </template>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="80px">
      <el-form-item label="文件名称" prop="fileName">
        <el-input class="w240" v-model="ruleForm.fileName" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="文件" prop="file">
        <!-- <input type="file" @change="loadKML" /> -->
        <upload-tool @getFile=getFile />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
// 组件传参
import mittBus from '@/utils/mittBus' // mitt
// 组件
import UploadTool from '../components/UploadTool.vue'
// api相关
import { apiCommon } from '@/utils/index.js'
import * as lgApi from "@/api/gis/gis";

const showDialog = ref(false)
const ruleFormRef = ref()

const emit = defineEmits(['dialogClosed'])
let ruleForm = ref({})

// poxy对象
const { proxy } = getCurrentInstance();

/**
 * 接收其他组件派发的方法
 */
// 关闭弹窗
mittBus.on('closeLoadKfmlFileDialog', () => {
  showDialog.value = false
})

/**
 * 父组件调弹框显示方法
 */
const show = () => {
  showDialog.value = true
  resetRuleFormData()
}

/**
 * 自组件传值方法
 */
const getFile = (file) => {
  // console.log("文件改变后触发", file, file.raw)

  ruleForm.value = {
    fileName: file.name,
    file: file.raw
  }
}

/**
 * 本页面业务
 */
/**
 * 校验 form 表单
 * @param {El} formEl form 的对象
 */
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      handleSubmitData()
    } else {
      console.log('error submit!', fields)
    }
  })
}

/**
 * 处理请求数据
 */
const handleSubmitData = async () => {
  // console.log(ruleForm.value)

  let formData = new FormData();
  // formData.append('fileName', ruleForm.value.fileName);
  formData.append('layerName', ruleForm.value.fileName);
  formData.append('file', ruleForm.value.file);

  // 获取所有值
  /* for (let keys of formData.values()) {
    console.log(keys);
  } */

  let config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };

  proxy.$modal.loading("正在提交，请稍候...");
  let submitData = await apiCommon(lgApi.uploadGisLayer, formData, config)
  // let submitData = await apiCommon(lgApi.uploadGisLayer, formData)
  // console.log(submitData)
  /* let submitData = {
    code: 200
  } */
  // console.log(submitData)
  proxy.$modal.closeLoading();

  if (submitData.code === 200) {
    proxy.$modal.msgSuccess('提交成功');

    showDialog.value = false

    // 通知图层列表刷新
    mittBus.emit('reloadLayerSelect')
  }
}

const rules = reactive({
  fileName: [{ required: true, message: '请输入', trigger: 'blur' }],
  file: [{ required: true, message: '请选择', trigger: 'blur' }],
})

defineExpose({ show })

const resetRuleFormData = async () => {
  nextTick(() => {
    ruleFormRef.value.resetFields()
    ruleForm.value = {}
  })
}
</script>
<style lang="scss" scoped></style>
