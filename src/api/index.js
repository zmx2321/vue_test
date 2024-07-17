import request from './axios'
import { getStorage } from '@/utils/storage.js'

let modulesApis = []
const files = import.meta.globEager('./modules/*.js')
// eslint-disable-next-line no-restricted-syntax
for (const key in files) {
  if (Object.hasOwnProperty.call(files, key)) {
    if (files[key].default) {
      modulesApis.push(...files[key].default)
    }
  }
}

export const apiUrls = new Map([...modulesApis])

// 常规请求头
export function http(apiName, params) {
  let [url, method, obj] = apiUrls.get(apiName)

  if (obj && !obj.noNeedOrgId) {
    params = {
      orgId: getStorage('orgId'),
      ...params
    }
  }

  // eslint-disable-next-line import/no-named-as-default-member
  return request[method](url, params, { ...obj })
}
