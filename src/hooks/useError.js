import { ElMessage } from 'element-plus'

export const showReqError = (res) => {
  ElMessage.error(res.subMessage)
}
