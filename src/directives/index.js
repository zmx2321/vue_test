// import auth from './modules/auth'
// import copy from './modules/copy'
// import waterMarker from './modules/waterMarker'
// import draggable from './modules/draggable'
// import debounce from './modules/debounce'
// import button from './modules/blur'
// import throttle from './modules/throttle'
// import longpress from './modules/longpress'

const modulesFiles = import.meta.glob('./modules/*.js', { eager: true })
const modules = {}

Object.keys(modulesFiles).forEach((path) => {
  const moduleName = path.replace(/^\.\/modules\/(.*)\.\w+$/, '$1')
  modules[moduleName] = modulesFiles[path].default
})
// const directivesList = {
//   auth,
//   button,
//   copy,
//   waterMarker,
//   draggable,
//   debounce,
//   throttle,
//   longpress
// }

const directives = {
  install(app) {
    Object.keys(modules).forEach((key) => {
      app.directive(key, modules[key])
    })
  }
}

export default directives
