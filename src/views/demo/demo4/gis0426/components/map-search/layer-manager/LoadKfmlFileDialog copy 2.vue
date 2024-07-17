<template>
  <el-dialog width="450px" v-model="showDialog" :close-on-click-modal="false" :modal-append-to-body="false"
    :close-on-press-escape="false">
    <template #header>
      <span>导入kml</span>
    </template>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="130px">
      <!-- <el-form-item label="属性分类" prop="classId">
        <el-select v-model="ruleForm.classId" class="w240" placeholder="请选择">
          <el-option v-for="item in orgLabelOptions" :key="item.id" :label="item.name" :value="item.id"
            v-auth="'findPropClassList'"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="文件名称" prop="name">
        <el-input class="w240" v-model="ruleForm.fileName" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-blur @click="showDialog = false">取消</el-button>
        <el-button v-blur type="primary" @click="submitForm(ruleFormRef)">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { http } from '@/api'
import { showReqError } from '@/hooks/useError'
import { getStorage } from '@/utils/storage'

const showDialog = ref(false)
const ruleFormRef = ref()
let tempParentId = ''
let orgLabelOptions = ref([])

const emit = defineEmits(['dialogClosed'])
let isEdit = false
let ruleForm = ref({
  name: '',
  isDiscount: ''
})

/**
 * 父组件调弹框显示方法
 */
const show = (row) => {
  showDialog.value = true
}

/**
 *  弹框关闭，父组件更新
 */
const dialogClosed = () => {
  emit('dialogClosed')
}

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
  const apiName = !isEdit ? 'insertProp' : 'modifyProp'
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
  }
}

const rules = reactive({
  fileName: [{ required: true, message: '请输入', trigger: 'blur' }]
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
