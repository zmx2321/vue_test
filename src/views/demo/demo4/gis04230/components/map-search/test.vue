<template>
    <el-autocomplete v-model="state" :fetch-suggestions="querySearchAsync" placeholder="Please input"
        @select="handleSelect" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

// api相关
import { apiCommon } from '@/utils/index.js'
import { queryCellListByCellName } from "@/api/gis/gis";

const state = ref('')

const links = ref([])

const testapi = async () => {
    let params = {
        cellName: state.value
    }
    let gisData = await apiCommon(queryCellListByCellName, params)
    console.log(gisData)

    return gisData.data
}

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

let timeout
const querySearchAsync = (queryString, cb) => {
    /* let aa = testapi()

    aa.then(datalist=> {
        console.log(aa)
    }) */
    // testapi()
    const results = queryString
        ? links.value.filter(createFilter(queryString))
        : links.value

    console.log(results)

    /* clearTimeout(timeout)
    timeout = setTimeout(() => {
        cb(results)
    }, 3000 * Math.random()) */

    testapi().then(res => {
        console.log(res)

        res.forEach(item => {
            item.value = item.cellName
        })

        cb(res)
    })
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

onMounted(() => {
    links.value = loadAll()
})
</script>