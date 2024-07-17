// const baseURI = import.meta.env.VITE_API_PROXY_URI
const mockURI = import.meta.env.VITE_API_PROXY_URI_MOCK

export default [
  /**
   * noLoading: 这个接口请求不需要全局loading
   * noNeedOrgId: 这个接口请求不需要 orgId
   */

  // 地图接口
  ['getMapData', [`${mockURI}/home/map`, 'get', { noLoading: true }]],
  ['getMapData1', [`${mockURI}/indicators`, 'get', { noLoading: true }]]
  // ['getMapData', ['/mock/zhgs_data_syn/dev/level/kanban/home/map', 'post', { noLoading: true, noNeedOrgId: true }]]
  // ['getMapData', ['http://183.129.232.106:8925/zhgs_data_syn/dev/level/kanban/home/map', 'post', { noLoading: true, noNeedOrgId: true }]]
]
