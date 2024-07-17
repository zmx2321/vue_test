<template>
    <section class="lend_wrap">
        <el-table :data="tableData" v-show="toggleFlag">
            <el-table-column prop="lendType" label="频率"></el-table-column>
            <el-table-column label="颜色">
                <template #default="scope">
                    <b class="lend_color" :style="{ background: scope.row.color }"></b>
                </template>
            </el-table-column>
            <el-table-column prop="size" label="半径(px)"></el-table-column>
        </el-table>

        <div class="toggle" :title="`点击${!toggleFlag ? '显示' : '隐藏'}图例`" @click="toggleLend"></div>
    </section>
</template>

<script setup>
import { ref } from 'vue'

let toggleFlag = ref(false)

/**
 * 根据频率获取数据
 * 
 * A频段  100  填充: rgba(200, 22, 100, 0.4)   线:
 * D频段  110  填充: rgba(55, 33, 188, 0.4)   线:
 * E频段  120  填充: rgba(88, 99, 200, 0.4)   线:
 * F频段  130  填充: rgba(255, 255, 0, 0.4)   线:
 * FDD  140   填充:  rgba(255, 76, 127, 0.4)  线:
 * 其他  150  填充:  rgba(32, 222, 230, 0.4)   线 : rgba(255, 205, 67, 0.3)
 */
const tableData = ref([{
    lendType: 'A频段',
    color: 'rgba(200, 22, 100, 0.4)',
    size: 100
}, {
    lendType: 'D频段',
    color: 'rgba(55, 33, 188, 0.4)',
    size: 110
}, {
    lendType: 'E频段',
    color: 'rgba(88, 99, 200, 0.4)',
    size: 120
}, {
    lendType: 'F频段',
    color: 'rgba(255, 255, 0, 0.4)',
    size: 130
}, {
    lendType: 'FDD',
    color: 'rgba(255, 76, 127, 0.4)',
    size: 140
}, {
    lendType: '其他',
    color: 'rgba(32, 222, 230, 0.4)',
    size: 150
}])

const toggleLend = () => {
    toggleFlag.value = !toggleFlag.value
}
</script>

<style lang="scss" scoped>
$bgColorHeader: rgba(24, 102, 237, 0.8);
$bgColorBody: rgba(24, 102, 237, 0.4);

.lend_wrap {
    position: absolute;
    bottom: 30px;
    right: 30px;
    // padding: 10px;
    // background: $bgColorBody;
    // border-radius: 10px;

    :deep(.el-table) {
        cursor: pointer;
        border-radius: 10px;

        .el-table__inner-wrapper {
            .el-table__header-wrapper {
                table.el-table__header {
                    thead {
                        tr {
                            th {
                                background: $bgColorHeader !important;
                                padding: 0;
                                margin: 0;

                                .cell {
                                    color: #fff;
                                }
                            }
                        }

                    }
                }
            }

            .el-table__body-wrapper {
                // background: #f00 !important;
                background: $bgColorBody !important;

                table.el-table__body {
                    // background: $bgColorBody !important;

                    tbody {
                        // background: $bgColorBody !important;

                        tr {
                            background: $bgColorBody !important;

                            &:hover {
                                background: $bgColorBody !important;

                                td.el-table__cell {
                                    cursor: pointer;
                                    background: $bgColorBody;
                                }
                            }

                            td {
                                .cell {
                                    color: #fff;
                                }
                            }
                        }
                    }
                }
            }
        }

        .lend_color {
            display: block;
            width: 15px;
            height: 15px;
            text-align: center;
        }
    }

    .toggle {
        position: absolute;
        bottom: -22px;
        right: -22px;
        width: 25px;
        height: 24px;
        background: url("../icon/toggle_lend.svg") center center no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
    }
}
</style>