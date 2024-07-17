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

        <el-form-item label="基站类型">
            <el-radio-group v-model="ruleForm.coverType" @change="setCoverType">
                <el-radio label="">全部</el-radio>
                <el-radio label="4g">室内</el-radio>
                <el-radio label="5g">室外</el-radio>
            </el-radio-group>
        </el-form-item>

        <!-- <el-form-item label="CGI" prop="CGI">
            <el-input class="w220" v-model="ruleForm.CGI" placeholder="请输入" @blur="searchByCGI" />
        </el-form-item> -->

        <el-form-item label="">
            <el-select v-model="ruleForm.searchType" style="width: 115px" @change="selectContactType">
                <el-option label="CGI" value="CGI"></el-option>
                <el-option label="小区名称" value="小区名称"></el-option>
            </el-select>
            <el-input v-model="input" style="width: 240px" placeholder="Please input" />
            <el-button type="primary">
                <el-icon>
                    <Search />
                </el-icon>
            </el-button>
            <el-autocomplete v-model="ruleForm.cellName" :fetch-suggestions="querySearch" @select="selectcCellName"
                style="width: 400px" placeholder="请输入" clearable :trigger-on-focus="true">
                <template #prepend>
                    <el-select v-model="ruleForm.searchType" style="width: 115px" @change="selectContactType">
                        <el-option label="CGI" value="CGI"></el-option>
                        <el-option label="小区名称" value="小区名称"></el-option>
                    </el-select>
                </template>
                <template #default="{ item }">
                    <div class="auto_cellname_item_wrap">
                        <h3>{{ item.cgi }}</h3>
                        <span>{{ item.newCellName }}</span>
                    </div>
                </template>
                <template #append>
                    <el-button type="primary">
                        <el-icon>
                            <Search />
                        </el-icon>
                    </el-button>
                </template>
            </el-autocomplete>
            <!-- <el-input v-model="input3" style="max-width: 600px" placeholder="Please input" class="input-with-select">
                <template #prepend>
                    <el-select v-model="select" placeholder="Select" style="width: 115px">
                        <el-option label="Restaurant" value="1" />
                        <el-option label="Order No." value="2" />
                        <el-option label="Tel" value="3" />
                    </el-select>
                </template>
                <template #append>
                    <el-button type="primary">
                        <el-icon>
                            <Search />
                        </el-icon>
                    </el-button>
                </template>
            </el-input> -->

        </el-form-item>

        <el-form-item label="CGI" prop="CGI">
            <!-- <el-input class="w220" v-model="ruleForm.CGI" placeholder="请输入" @blur="searchByCGI" /> -->
            <test />
        </el-form-item>
    </el-form>
</template>

<script setup>
import { ref } from 'vue'
import mittBus from '@/utils/mittBus' // mitt

import test from './test.vue'

const ruleFormRef = ref(null)
const ruleForm = ref({
    searchType: 'CGI'
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

// 查询基站类型
const setCoverType = () => {
    // console.log(ruleForm.value.contactType)

    mittBus.emit('getCoverType', ruleForm.value.coverType)
}

// 查询cgi
const searchByCGI = () => {
    // console.log(ruleForm.value.CGI)

    mittBus.emit('searchByCGI', ruleForm.value.CGI)
}

/* // 选择网络制式
const selectContactType = () => {
    // console.log(ruleForm.value.selectedContactTypeToCellName)

    ruleForm.value.cellName = ""

    mittBus.emit('selectContactType', ruleForm.value.selectedContactTypeToCellName)
} */

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