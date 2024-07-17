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

        <!-- <el-form-item label="CGI" prop="CGI">
            <el-input class="w220" v-model="ruleForm.CGI" placeholder="请输入" @blur="searchByCGI" />
        </el-form-item> -->

        <el-form-item label="">
            <el-autocomplete v-model="ruleForm.dynamicFieldsValue" :fetch-suggestions="querySearch"
                @select="selectGisSearchSubmit" style="width: 400px" placeholder="请输入" clearable
                :trigger-on-focus="true" :debounce=100>
                <template #prepend>
                    <el-select v-model="ruleForm.searchType" style="width: 115px" @change="selectSearchCriteria">
                        <!-- <el-option label="CGI" value="CGI"></el-option>
                        <el-option label="小区名称" value="小区名称"></el-option> -->
                        <el-option v-for="(item, index) in searchCriteriaList" :key="item.index" :label="item.label"
                            :value="item.prop" />
                    </el-select>
                </template>
                <template #default="{ item }">
                    <div class="auto_cellname_item_wrap">
                        <h3>[{{ item.networkType }}] {{ item.cgi }} </h3>
                        <span>{{ item.cellName }}</span>
                        <span>{{ item.coverType }}</span>
                    </div>
                </template>
                <template #append>
                    <el-button type="primary" @click="setGisSearchSubmit">
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

        <!-- <el-form-item label="CGI" prop="CGI">
            <test />
        </el-form-item> -->
        <!-- <el-form-item label="CGI" prop="CGI">
            <test />
        </el-form-item> -->
    </el-form>
</template>

<script setup>
import { ref } from 'vue'
// 组件传参
import mittBus from '@/utils/mittBus' // mitt
// store
import { gisDataStore } from '@/store/modules/gis.js'

const gisStoreData = gisDataStore()

import test from './test.vue'

const ruleFormRef = ref(null)
const isShowFocus = ref(false)  // 是否直接显示下拉

// 搜索条件
const searchCriteriaList = ref([{
    label: 'CGI',
    prop: 'CGI',
    eventName: 'searchByCGI',
    isShowSelect: false
}, {
    label: '小区名称',
    prop: 'cellName',
    eventName: 'searchByCellName',
    isShowSelect: true
}])

const ruleForm = ref({
    contactType: 'all',  // 网络制式
    coverType: 'all',  // 基站类型
    searchType: searchCriteriaList.value[0].prop,  // 搜索条件,默认cgi
    dynamicFieldsValue: ''  // 动态字段结果
    // selectedContactTypeToCellName: ''  // 为查询小区名称被选择的网络制式
})

// const cellNameData = ref([])  // 小区名称数据

let resData = ref([])  // 搜索下拉框结果数据

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

/* const loadAll = () => {
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

resData.value = loadAll() */


/**
 * 接收其他组件派发的方法
 */
//  获取小区名称列表
mittBus.on('getCellNameSelectData', async (cellNameList) => {
    console.log("获取小区名称列表", cellNameList)
    isShowFocus.value = true

    resData.value = cellNameList
    // resData.value = loadAll()
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

// 选择搜索条件
const selectSearchCriteria = () => {
    console.log('搜索类型', ruleForm.value.searchType, ruleForm.value.dynamicFieldsValue)

    ruleForm.value.dynamicFieldsValue = ""
    resData.value = []
}

// gis查询
const setGisSearchSubmit = () => {
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

/* // 查询cgi
const searchByCGI = () => {
    // console.log(ruleForm.value.CGI)

    mittBus.emit('searchByCGI', ruleForm.value.CGI)
} */

/* // 选择网络制式
const selectContactType = () => {
    // console.log(ruleForm.value.selectedContactTypeToCellName)

    ruleForm.value.cellName = ""

    mittBus.emit('selectContactType', ruleForm.value.selectedContactTypeToCellName)
} */

// 根据网络制式选择数据
const querySearch = (queryString, cb) => {
    // console.log('32432', queryString, resData.value, ruleForm.value.searchType)

    searchCriteriaList.value.forEach(item => {
        // 识别当前搜索条件
        if (item.prop === ruleForm.value.searchType) {
            // 如果不需要模糊搜索不显示下拉框
            if (!item.isShowSelect) {
                resData.value = []
            } else {
                // resData.value = loadAll()
                // setTimeout(() => {
                //     setGisSearchSubmit()

                //     console.log("6666666", gisStoreData.gisSearchOptionData)

                //     /* const results = queryString
                //         ? resData.value.filter(createFilter(queryString))
                //         : resData.value

                //     cb(results) */
                // }, 0)
                // setGisSearchSubmit()
                // console.log(2222, resData.value)

                setGisSearchSubmit()

                // resData.value = loadAll()

                setTimeout(() => {
                    resData.value = gisStoreData.gisSearchOptionData
                    console.log("6666666", gisStoreData.gisSearchOptionData)
                }, 5000)

            }
        }
    })

    // setGisSearchSubmit()


    const results = queryString
        ? resData.value.filter(createFilter(queryString))
        : resData.value

    cb(results)
}

// 下拉选择
const selectGisSearchSubmit = () => {
    console.log('下拉选择')

    setGisSearchSubmit()
}
/* // 选择小区名称
const selectcCellName = (item) => {
    let itemData = JSON.parse(JSON.stringify(item))
    // console.log("选择数据", itemData)

    mittBus.emit('selectcCellName', itemData)
} */

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