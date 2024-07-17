<template>
    <el-form ref="ruleFormRef" :inline="true" :model="ruleForm" label-width="80px">
        <!-- <el-form-item label="网络制式" prop="contactType">
            <el-select v-model="ruleForm.contactType" @change="setContactType">
                <el-option label="全部" value=""></el-option>
                <el-option label="4g" value="4g"></el-option>
                <el-option label="5g" value="5g"></el-option>
            </el-select>
        </el-form-item> -->
        <el-form-item label="网络制式">
            <el-radio-group v-model="ruleForm.contactType" @change="setContactType">
                <el-radio label="">全部</el-radio>
                <el-radio label="4g">4g</el-radio>
                <el-radio label="5g">5g</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item label="CGI" prop="CGI">
            <el-input class="w220" v-model="ruleForm.CGI" placeholder="请输入" @blur="searchByCGI" />
        </el-form-item>

        <el-form-item label="小区名称" prop="cellName">
            <el-autocomplete v-model="ruleForm.cellName" :fetch-suggestions="querySearch" @select="selectcCellName"
                style="width: 400px" placeholder="请输入" clearable :trigger-on-focus="true">
                <!-- 后置图标 -->
                <template #suffix>
                    <el-icon class="el-input__icon">
                        <search />
                    </el-icon>
                </template>
                <!-- 前置 -->
                <template #prepend>
                    <el-select v-model="ruleForm.selectedContactTypeToCellName" style="width: 115px"
                        @change="selectContactType">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="4g" value="4g"></el-option>
                        <el-option label="5g" value="5g"></el-option>
                    </el-select>
                </template>
                <!-- 自定义内容 -->
                <template #default="{ item }">
                    <div class="auto_cellname_item_wrap">
                        <h3>{{ item.cgi }}</h3>
                        <span>{{ item.newCellName }}</span>
                    </div>
                </template>
            </el-autocomplete>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { ref } from 'vue'
import mittBus from '@/utils/mittBus' // mitt

const ruleFormRef = ref(null)
const ruleForm = ref({
    // selectedContactTypeToCellName: ''  // 为查询小区名称被选择的网络制式
})

const cellNameData = ref([])  // 小区名称数据

/**
 * 接收其他组件派发的方法
 */
//  获取小区名称列表
mittBus.on('getCellNameSelectData', async (cellNameList) => {
    // console.log("获取小区名称列表", cellNameList)

    cellNameData.value = cellNameList
})

/**
 * tools
 */
// 自动补全输入框
const createFilter = (queryString) => {
    // console.log(queryString, restaurant)
    return (restaurant) => {
        return (
            restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
    }
}

/**
 * 业务
 */
// 查询网络制式
const setContactType = () => {
    // console.log(ruleForm.value.contactType)

    mittBus.emit('getContactType', ruleForm.value.contactType)
}

// 查询cgi
const searchByCGI = () => {
    // console.log(ruleForm.value.CGI)

    mittBus.emit('searchByCGI', ruleForm.value.CGI)
}

// 选择网络制式
const selectContactType = () => {
    // console.log(ruleForm.value.selectedContactTypeToCellName)

    ruleForm.value.cellName = ""

    mittBus.emit('selectContactType', ruleForm.value.selectedContactTypeToCellName)
}

// 根据网络制式选择数据
const querySearch = (queryString, cb) => {
    const results = queryString
        ? cellNameData.value.filter(createFilter(queryString))
        : cellNameData.value

    cb(results)
}

// 选择小区名称
const selectcCellName = (item) => {
    let itemData = JSON.parse(JSON.stringify(item))
    // console.log("选择数据", itemData)

    mittBus.emit('selectcCellName', itemData)
}

</script>

<style lang="scss" scoped>
.el-popper.is-pure {
    .auto_cellname_item_wrap {
        // background: #f00;
        border-bottom: solid 1px #efefef;
        // padding-bottom: 10px;

        span {
            display: block;
            margin-top: -15px;

        }
    }
}
</style>