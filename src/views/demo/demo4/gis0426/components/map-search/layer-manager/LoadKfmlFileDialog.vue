<template>
  <el-dialog width="450px" v-model="showDialog" :close-on-click-modal="false" :modal-append-to-body="false"
    :close-on-press-escape="false">
    <template #header>
      <span>导入kml</span>
    </template>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="80px">
      <el-form-item label="文件名称" prop="fileName">
        <el-input class="w240" v-model="ruleForm.fileName" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="文件" prop="file">
        <input type="file" @change="loadKML" />
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
import { ElMessage } from 'element-plus'
// 组件传参
import mittBus from '@/utils/mittBus' // mitt

const showDialog = ref(false)
const ruleFormRef = ref()

const emit = defineEmits(['dialogClosed'])
let ruleForm = ref({
  name: '',
})

/**
 * 父组件调弹框显示方法
 */
const show = (row) => {
  showDialog.value = true
  // resetRuleFormData()
}

const loadKML = (event) => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;

    mittBus.emit('loadKML', text)
  };
  reader.readAsText(file);
}

// 接收其他组件派发的方法
mittBus.on('closeLoadKfmlFileDialog', () => {
  showDialog.value = false
})

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
  /* const apiName = !isEdit ? 'insertProp' : 'modifyProp'
  const params = {
    ...ruleForm.value,
    orgId: getStorage('orgId')
  }

  if (tempParentId) {
    params.parentId = tempParentId
  }
  console.log(params)
  try {
    let res = await http(apiName, params)
    if (res.isError) return showReqError(res)
    ElMessage.success('保存成功')
    showDialog.value = false
    dialogClosed()
  } catch (error) {
    console.log(error)
  } */
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
