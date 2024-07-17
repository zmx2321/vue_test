import axios from 'axios'
import { ElMessage } from 'element-plus'
import { showFullScreenLoading, tryHideFullScreenLoading } from '@/config/serviceLoading'

import { ResultEnum } from './httpEnum'
import { checkStatus } from './helper/checkStatus'
import router from '@/router'
import { getStorage } from '@/utils/storage.js'

const commonConfig = {
  // 默认地址请求地址，可在 .env.** 文件中修改
  // baseURL: import.meta.env.VITE_API_URL,
  // 设置超时时间
  timeout: ResultEnum.TIMEOUT,
  // 跨域时候允许携带凭证
  withCredentials: true
}

class RequestHttp {
  constructor(temConfig) {
    // instantiation
    this.service = axios.create(temConfig)

    /**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的 token,存储到 vuex/pinia/本地储存当中
     */
    this.service.interceptors.request.use(
      (config) => {
        // 当前请求不需要显示 loading，在 api 服务中通过指定的第三个参数: { noLoading: true } 来控制
        config.noLoading || showFullScreenLoading()
        if (config.headers && typeof config.headers.set === 'function') {
          config.headers.set('authToken', getStorage('authToken') || '')
          config.headers.set('masterOrgId', getStorage('masterOrgId') || '')
          config.headers.set('moduleCode', getStorage('moduleCode') || '')
          config.headers.set('appCode', getStorage('appCode') || '')
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response) => {
        const { data } = response
        tryHideFullScreenLoading()
        // 登陆失效
        if (response.status === ResultEnum.OVERDUE) {
          console.log(response)
          ElMessage.error(data.subMessage)
          return Promise.reject(data)
        }
        // 全局错误信息拦截（防止下载文件的时候返回数据流，没有 code 直接报错）
        if (response.status && response.status !== ResultEnum.SUCCESS) {
          ElMessage.error(data.subMessage)
          return Promise.reject(data)
        }
        // 错误处理
        data.isError = data.code !== 0
        // 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
        return data
      },
      async (error) => {
        const { response } = error
        tryHideFullScreenLoading()
        // 请求超时 && 网络错误单独判断，没有 response
        if (error.message.indexOf('timeout') !== -1) ElMessage.error('请求超时！请您稍后重试')
        if (error.message.indexOf('Network Error') !== -1) ElMessage.error('网络错误！请您稍后重试')
        // 根据服务器响应的错误状态码，做不同的处理

        if (response) {
          if (response.data.subCode === 'TOKEN_MODULE_FAIL') {
            ElMessage.error(response.data.subMessage)
          } else {
            checkStatus(response.status)
          }
        }
        // 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
        if (!window.navigator.onLine) router.replace('/500')
        return Promise.reject(error)
      }
    )
  }

  /**
   * @description 常用请求方法封装
   */
  get(url, params = {}, _object = {}) {
    return this.service.get(url, { params, ..._object })
  }

  post(url, params = {}, _object = {}) {
    console.log(_object)
    return this.service.post(url, params, _object)
  }

  put(url, params = {}, _object = {}) {
    return this.service.put(url, params, _object)
  }

  delete(url, params = {}, _object = {}) {
    return this.service.delete(url, { params, ..._object })
  }

  download(url, params = {}, _object = {}) {
    return this.service.post(url, params, { ..._object, responseType: 'blob' })
  }
}

export default new RequestHttp(commonConfig)
