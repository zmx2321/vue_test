<template>
    <el-autocomplete v-model="state" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect">
        <template #default="{ item }">
            <!-- <div class="value">{{ item.value }}</div>
            <div class="label">{{ item.label }}</div> -->

            <!-- <div>{{ item }}</div> -->
            <div v-for="jItm in item.options">
                <!-- {{ jItm }} -->
                <div class="value">{{ jItm.value }}</div>
                <div class="label">{{ jItm.label }}</div>
            </div>
        </template>
    </el-autocomplete>
</template>

<script>
export default {
    data() {
        return {
            state: '',
            options: [
                {
                    label: 'Group A',
                    options: [
                        { value: 'Group A Option 1', label: 'Group A Option 1' },
                        { value: 'Group A Option 2', label: 'Group A Option 2' },
                    ],
                },
                {
                    label: 'Group B',
                    options: [
                        { value: 'Group B Option 1', label: 'Group B Option 1' },
                        { value: 'Group B Option 2', label: 'Group B Option 2' },
                    ],
                },
            ],
        };
    },
    methods: {
        querySearch(queryString, cb) {
            let results = this.options;
            cb(results);
        },
        handleSelect(item) {
            console.log('Selected: ' + JSON.stringify(item));
            // this.options = item
        },
    },
};
</script>

<style>
.value {
    margin-bottom: 5px;
    font-weight: bold;
}

.label {
    font-size: 12px;
    color: #999;
}
</style>