import request from '@/utils/request'

let base = '/prod-api'

// 获取gis数据列表
export const queryGisList = (params) => {
  return request({
    url: '/gis/queryCellList',
    method: 'post',
    data: params
  })
}

// 根据Cgi查询
export const queryCellByCgi = (params) => {
  return request({
    url: '/gis/queryCellByCgi',
    method: 'get',
    params
  })
}

// 根据CelIName查询
export const queryCellListByCellName = (params) => {
  return request({
    url: '/gis/queryCellListByCellName',
    method: 'get',
    params
  })
}

/* // 获取基站工参信息
export function getPhysicalSiteInfo() {
    return request({
      url: 'http://127.0.0.1:4523/m1/4161997-0-default/api/gis/physicalSiteInfo',
      // url: '/gis/physicalSiteInfo',
      method: 'get'
    })
}

// 获取网格信息
export function getGridLisInfo() {
    return request({
      url: 'http://127.0.0.1:4523/m1/4161997-0-default/api/gis/gridListInfo',
      // url: '/gis/gridListInfo',
      method: 'get'
    })
}

// 获取4g
export const queryCell4gList = (params) => {
  return request({
    url: '/gis/queryCell4gList',
    method: 'post',
    data: params
  })
}

// 获取5g
export const queryCell5gList = (params) => {
  return request({
    url: '/gis/queryCell5gList',
    method: 'post',
    data: params
  })
}

// 根据CGI查询
export const getDataByCGI = (CGI="") => {
  return request({
    url: '/gis/cgi/' + CGI,  // 测试
    method: 'get',
  })
}

// 根据网络制式获取数据列表 下拉  cellName
export const getSelectDataByContactType = (params) => {
  return request({
    url: '/gis/name',
    method: 'post',
    data: params
  })
} */
