<template>
  <section class="layer_tree_wrap">
    <!-- <el-tree style="max-width: 600px" :data="treeData" :props="{
      children: 'children',
      label: 'label',
    }" @node-click="handleNodeClick" /> -->

    <el-input v-model="filterText" placeholder="Filter keyword" />

    <el-tree ref="refTree" show-checkbox class="filter-tree" :data="treeData" :props="defaultProps" default-expand-all
      :filter-node-method="filterNode" @node-click="handleNodeClick" @check="handleCheckChange" empty-text="加载中，请稍后" />
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import treeData from './treeData.js'

const filterText = ref('')
const refTree = ref(null)

const defaultProps = ref({
  children: 'children',
  label: 'label',
})

watch(filterText, (val) => {
  treeRef.value.filter(val)
})

const filterNode = (value, data) => {
  if (!value) return true
  return data.label.includes(value)
}

const handleNodeClick = (value) => {
  // console.log(value)
}

const handleCheckChange = (data) => {
  /* // 如果存在
  if (data.id.indexOf("user_") !== -1) {
    // console.log(data.id);
    this.sendData.userNameStr = data.id
  } else {
    this.sendData.userNameStr = ""
  }

  // 渲染到树
  let labvalojb = data; // 暂存选中节点
  this.$refs.sendTree.setCheckedKeys([]); // 删除所有选中节点
  this.$refs.sendTree.setCheckedNodes([labvalojb]); // 选中已选中节点 */
}
</script>

<style lang="scss" scoped>
.layer_tree_wrap {
  position: fixed;
  margin-top: 12px;
  padding: 10px;
  width: 38vw;
  height: 72vh;
  background: rgb(255 255 255 / 80%);
  border-radius: 10px;

  :deep .el-input {
    margin-bottom: 10px;

    .el-input__wrapper {
      background: rgb(255 255 255 / 0%);
    }
  }

  :deep .el-tree {
    max-width: 600px;
    height: 65vh;
    overflow-y: auto;
    background: rgb(255 255 255 / 0%);

    .el-tree-node__content {
      transition: .2s linear;
      border-radius: 10px;

      &:hover {
        background: #2c94fe;
        color: #ffffff;
      }
    }

    .el-tree-node .is-leaf+.el-checkbox .el-checkbox__inner {
      display: inline-block;
    }

    .el-tree-node .el-checkbox .el-checkbox__inner {
      display: none;
    }
  }
}
</style>