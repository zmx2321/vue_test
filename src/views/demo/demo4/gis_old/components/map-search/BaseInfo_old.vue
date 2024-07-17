<template>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="80px">
        <el-form-item label="选择工参" prop="contactType">
            <el-select v-model="ruleForm.contactType" @change="setContactType">
                <el-option label="全部" value=""></el-option>
                <el-option label="4g" value="4g"></el-option>
                <el-option label="5g" value="5g"></el-option>
            </el-select>
        </el-form-item>

        <!-- <el-form-item>
            <el-button type="primary" @click="endZsSubmit('baseInfoForm')">提交</el-button>
            <el-button @click="resetForm('baseInfoForm')">重置</el-button>
        </el-form-item> -->

        <!-- <el-form-item label="属性分类" prop="classId">
            <el-select v-model="ruleForm.classId" class="w240" placeholder="请选择">
                <el-option v-for="item in orgLabelOptions" :key="item.id" :label="item.name"
                    :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="属性名称" prop="name">
            <el-input class="w240" v-model="ruleForm.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="加价价格" prop="propValue">
            <el-input class="w240" v-model="ruleForm.propValue" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="排序码" prop="sequence">
            <el-input class="w240" v-model="ruleForm.sequence" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="是否参与单品折扣" prop="isDiscount">
            <el-radio-group v-model="ruleForm.isDiscount" class="ml-4" style="margin-top: -4px">
                <el-radio :label="1" size="large">是</el-radio>
                <el-radio :label="0" size="large">否</el-radio>
            </el-radio-group>
        </el-form-item> -->
        <!-- <el-form-item label="分类下属性是否允许修改数量" prop="isModifyQuantity">
        <el-radio-group v-model="ruleForm.isModifyQuantity" class="ml-4">
          <el-radio label="1" size="large">是</el-radio>
          <el-radio label="0" size="large">否</el-radio>
        </el-radio-group>
      </el-form-item> -->
    </el-form>
</template>

<script setup>
import { ref } from 'vue'

const ruleFormRef = ref(null)

let ruleForm = ref({})

const setContactType = () => {
    console.log(ruleForm.contactType)
}

const rules = reactive({
    //   classId: [{ required: true, message: '请选择', trigger: 'blur' }],
    //   name: [{ required: true, message: '请输入', trigger: 'blur' }]
})

/**
 * 校验 form 表单
 * @param {El} formEl form 的对象
 */
/* const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            handleSubmitData()
        } else {
            console.log('error submit!', fields)
        }
    })
} */

/**
 * 处理请求数据
 */
// const handleSubmitData = async () => {
//     /* const apiName = !isEdit ? 'insertProp' : 'modifyProp'
//     const params = {
//       ...ruleForm.value
//     }
  
//     if (tempParentId) {
//       params.parentId = tempParentId
//     }
//     console.log(params)
//     try {
//       let res = await http(apiName, params)
//       if (res.isError) return showReqError(res)
//       ElMessage.success('保存成功')
//       showDialog.value = false
//       dialogClosed()
//     } catch (error) {
//       console.log(error)
//     } */
// }

</script>

<style lang="scss" scoped></style>