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
                <el-radio label="">全部</el-radio>
                <el-radio label="室内">室内</el-radio>
                <el-radio label="室外">室外</el-radio>
            </el-radio-group>
        </el-form-item>

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
        </el-form-item>
    </el-form>
</template>

<script setup>
import { ref } from 'vue'
// 组件传参
import mittBus from '@/utils/mittBus' // mitt
// store
// import { gisDataStore } from '@/store/modules/gis.js'
// api相关
import { apiCommon } from '@/utils/index.js'
import { queryCellListByCellName } from "@/api/gis/gis";

// const gisStoreData = gisDataStore()

const ruleFormRef = ref(null)

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
    coverType: '',  // 基站类型
    searchType: searchCriteriaList.value[0].prop,  // 搜索条件,默认cgi
    dynamicFieldsValue: ''  // 动态字段结果
    // dynamicFieldsValue: 'H949990-宁波江北奥体中心体育馆内场临时EasyMarco-HLH-D101-65'  // 动态字段结果
    // dynamicFieldsValue: '460-00-815600-69'  // 动态字段结果 - 室外cgi测试
    // dynamicFieldsValue: '460-00-405194-1'  // 动态字段结果 - 室内cgi测试
})

let resData = ref([])  // 搜索下拉框结果数据

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
    // console.log(ruleForm.value.coverType)

    if (ruleForm.value.coverType === '') {
        ruleForm.value.coverType = undefined
    }

    mittBus.emit('getCoverType', ruleForm.value.coverType)
}

// 选择搜索条件
const selectSearchCriteria = () => {
    // console.log('搜索类型', ruleForm.value.searchType, ruleForm.value.dynamicFieldsValue)

    ruleForm.value.dynamicFieldsValue = ""
    resData.value = []
}

// gis查询
const setGisSearchSubmit = () => {
    // console.log('gis查询', ruleForm.value.searchType, ruleForm.value.dynamicFieldsValue)

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
}

// 根据网络制式选择数据
const querySearch = async (queryString, cb) => {
    searchCriteriaList.value.forEach(async item => {
        // 识别当前搜索条件
        if (item.prop === ruleForm.value.searchType) {
            // 如果不需要模糊搜索不显示下拉框
            if (!item.isShowSelect) {
                cb([])
            } else {
                let params = {
                    cellName: queryString
                }
                let gisData = await apiCommon(queryCellListByCellName, params)

                gisData.data.forEach(item => {
                    item.value = item.cellName
                })

                // resData.value = gisData.data
                cb(gisData.data)
            }
        }
    })
}

// 搜索框下拉选择
const selectGisSearchSubmit = (val) => {
    // console.log('搜索框下拉选择', val)

    mittBus.emit('selectGisSearchSubmit', val)
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