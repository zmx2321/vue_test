// @ts-ignore 兼容性 requestAnimationFrame
export const requestAnimationFrame =
  window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
// @ts-ignore 兼容性 cancelAnimationFrame
export const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame
// 使用 requestAnimationFrame 模拟 setTimeout 和 setInterval
export function rafTimeout(fn, delay = 0, interval = false) {
  // @ts-ignore
  // eslint-disable-next-line no-shadow
  const requestAnimationFrame =
    typeof window !== 'undefined'
      ? window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
      : () => {}
  let start = null
  function timeElapse(timestamp) {
    /*
      timestamp参数：与performance.now()的返回值相同，它表示requestAnimationFrame() 开始去执行回调函数的时刻
    */
    if (!start) {
      start = timestamp
    }
    const elapsed = timestamp - start
    if (elapsed >= delay) {
      fn() // 执行目标函数func
      if (interval) {
        // 使用间歇调用
        start = null
        raf.id = requestAnimationFrame(timeElapse)
      }
    } else {
      raf.id = requestAnimationFrame(timeElapse)
    }
  }
  const raf = {
    // 引用类型保存，方便获取 requestAnimationFrame()方法返回的 ID.
    id: requestAnimationFrame(timeElapse)
  }
  return raf
}
// 用于取消 rafTimeout 函数
export function cancelRaf(raf) {
  // @ts-ignore
  // eslint-disable-next-line no-shadow
  const cancelAnimationFrame = typeof window !== 'undefined' ? window.cancelAnimationFrame || window.mozCancelAnimationFrame : () => {}
  if (raf && raf.id) {
    cancelAnimationFrame(raf.id)
  }
}
