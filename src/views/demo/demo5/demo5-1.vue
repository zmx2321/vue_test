<template>
  <section>
    demo5-1

    <el-button @click="copyTextToClipboard('demo5-1')">copyTextToClipboard</el-button>
  </section>
</template>

<script setup>
import { ElMessage } from 'element-plus'

/* const copyTextToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Text copied to clipboard");

    ElMessage.success(`${text} 拷贝成功`);
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
} */

const copyTextToClipboard = async (text) => {
  // navigator clipboard 需要https等安全上下文
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard 向剪贴板写文本
    ElMessage.success(`${text}拷贝成功`);
    return navigator.clipboard.writeText(text);
  } else {
    // document.execCommand('copy') 向剪贴板写文本
    let input = document.createElement('input')
    input.style.position = 'fixed'
    input.style.top = '-10000px'
    input.style.zIndex = '-999'
    document.body.appendChild(input)
    input.value = text
    input.focus()
    input.select()
    try {
      let result = document.execCommand('copy')
      document.body.removeChild(input)
      if (!result || result === 'unsuccessful') {
        console.log('复制失败')
      } else {
        // console.log('复制成功')
        ElMessage.success(`${text} 拷贝成功`);
      }
    } catch (e) {
      document.body.removeChild(input)
      alert('当前浏览器不支持复制功能，请检查更新或更换其他浏览器操作')
    }
  }
}
</script>

<style lang="scss" scoped></style>