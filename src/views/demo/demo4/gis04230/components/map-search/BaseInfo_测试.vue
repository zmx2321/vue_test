<template>
    <el-form ref="ruleFormRef" :inline="true" :model="ruleForm" label-width="80px">
        <el-form-item label="网络制式">
            <el-radio-group v-model="ruleForm.contactType" @change="setContactType">
                <el-radio label="all">全部</el-radio>
                <el-radio label="4g">4g</el-radio>
                <el-radio label="5g">5g</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item label="基站类型">
            <el-radio-group v-model="ruleForm.coverType" @change="setCoverType">
                <el-radio label="all">全部</el-radio>
                <el-radio label="室内">室内</el-radio>
                <el-radio label="室外">室外</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item label="">
            <!-- <el-autocomplete v-model="ruleForm.dynamicFieldsValue" :fetch-suggestions="querySearch"
                @select="gisSearchSubmit" style="width: 400px" placeholder="请输入" clearable :trigger-on-focus="true"
                :debounce=100> -->
            <el-autocomplete v-model="ruleForm.dynamicFieldsValue" :fetch-suggestions="querySearch"
                placeholder="Please input" @select="gisSearchSubmit">
                <template #prepend>
                    <el-select v-model="ruleForm.searchType" style="width: 115px" @change="selectSearchCriteria">
                        <el-option v-for="(item, index) in searchCriteriaList" :key="item.index" :label="item.label"
                            :value="item.prop" />
                    </el-select>
                </template>
                <template #default="{ item }">
                    <div class="auto_cellname_item_wrap">
                        {{ item }}
                        <h3>{{ item.cgi }}</h3>
                        <span>{{ item.newCellName }}</span>
                    </div>
                </template>
                <template #append>
                    <el-button type="primary" @click="gisSearchSubmit">
                        <el-icon>
                            <Search />
                        </el-icon>
                    </el-button>
                </template>
            </el-autocomplete>
            <!-- <el-autocomplete v-model="state" :fetch-suggestions="querySearchAsync" placeholder="Please input"
                @select="handleSelect" /> -->
        </el-form-item>

        <el-form-item label="CGI" prop="CGI">
            <test />
        </el-form-item>
    </el-form>
</template>

<script setup>
import { ref } from 'vue'
import mittBus from '@/utils/mittBus' // mitt

import test from './test.vue'

const ruleFormRef = ref(null)
const isShowFocus = ref(false)  // 是否直接显示下拉

// 搜索条件
const searchCriteriaList = ref([{
    label: 'CGI',
    prop: 'CGI',
    eventName: 'searchByCGI'
}, {
    label: '小区名称',
    prop: 'cellName',
    eventName: 'searchByCellName'
}])

const ruleForm = ref({
    contactType: 'all',  // 网络制式
    coverType: 'all',  // 基站类型
    searchType: searchCriteriaList.value[0].prop,  // 搜索条件,默认cgi
    dynamicFieldsValue: ''  // 动态字段结果
    // selectedContactTypeToCellName: ''  // 为查询小区名称被选择的网络制式
})

let resData = ref([])  // 搜索下拉框结果数据


/**
 * 接收其他组件派发的方法
 */
//  获取小区名称列表
mittBus.on('getCellNameSelectData', async (cellNameList) => {
    console.log("获取小区名称列表", cellNameList)
    isShowFocus.value = true

    resData.value = cellNameList
})

/**
 * tools
 */
// 自动补全输入框
/* const createFilter = (queryString) => {
    // console.log(queryString, restaurant)
    return (restaurant) => {
        return (
            restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
    }
} */
const links = ref([])
const state = ref('')
const loadAll = () => {
    return [
        { value: 'vue', link: 'https://github.com/vuejs/vue' },
        { value: 'element', link: 'https://github.com/ElemeFE/element' },
        { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
        { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
        { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
        { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
        { value: 'babel', link: 'https://github.com/babel/babel' },
    ]
}

links.value = loadAll()

let timeout
const querySearchAsync = (queryString, cb) => {
    const results = queryString
        ? resData.value.filter(createFilter(queryString))
        : resData.value

    clearTimeout(timeout)
    timeout = setTimeout(() => {
        cb(results)
    }, 3000 * Math.random())
}
const createFilter = (queryString) => {
    return (restaurant) => {
        return (
            restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
    }
}

const handleSelect = (item) => {
    console.log(item)
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

// 选择搜索条件
const selectSearchCriteria = () => {
    console.log('搜索类型', ruleForm.value.searchType, ruleForm.value.dynamicFieldsValue)

    ruleForm.value.dynamicFieldsValue = ""
    resData.value = []
}

// gis查询
const gisSearchSubmit = () => {
    console.log('gis查询', ruleForm.value.searchType, ruleForm.value.dynamicFieldsValue)

    // 当输入内容时才派发事件
    if (ruleForm.value.dynamicFieldsValue !== '') {
        searchCriteriaList.value.forEach(item => {
            switch (ruleForm.value.searchType) {
                case item.prop:
                    // 根据定义的名称派发事件
                    mittBus.emit(item.eventName, ruleForm.value.dynamicFieldsValue)
                    break
            }
        })
    }

    /* switch (ruleForm.value.searchType) {

        case 'CGI':
            getCurrentViewPosition4G(myOlMap)
            break
        case '小区名称':
            getCurrentViewPosition5G(myOlMap)
            break
    } */
}

// 根据网络制式选择数据
const querySearch = (queryString, cb) => {
    console.log(1111)
    /* const results = queryString
        ? resData.value.filter(createFilter(queryString))
        : resData.value

    cb(results) */

    const results = queryString
        ? links.value.filter(createFilter(queryString))
        : links.value

    clearTimeout(timeout)
    timeout = setTimeout(() => {
        cb(results)
    }, 3000 * Math.random())
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