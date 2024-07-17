import axios from 'axios'
import { ElMessage } from 'element-plus'
import { http } from '@/api/index.js'
import { getStorage } from '@/utils/storage.js'

// a: 头像，l: 公司 logo，m: 素材上传
// 素材上传 type: 2: 图片，3: 视频，4: 音频
export function uploadFile(options) {
  const formData = new FormData()
  formData.append('files', options.file)
  formData.append('type', options.type)
  return new Promise((resolve) => {
    http('apiUploadMaterial', formData).then((res) => {
      if (res.code === 10000) {
        resolve(res.content)
      } else {
        ElMessage.error('资源上传失败，请稍后重新上传')
      }
    })
  })
}

export function exportExcel(params, tempUrl = '/api/crm/export/exportGrowthRecord') {
  // 导出表格
  const temConfig = {
    headers: {
      'Content-Type': 'application/json; application/octet-stream',
      authToken: getStorage('authToken')
    },
    responseType: 'arraybuffer'
  }
  return new Promise(() => {
    let url = import.meta.env.VITE_APP_BASE_URL + tempUrl
    axios.post(url, params, temConfig).then((res) => {
      if (res.status === 200) {
        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
          // word文档为application/msword,pdf文档为application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8
        })
        const objectUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        const fname = '表格.xlsx' // 下载文件的名字
        link.href = objectUrl
        link.setAttribute('download', decodeURI(fname))
        document.body.appendChild(link)
        link.click()
      }
    })
  })
}
