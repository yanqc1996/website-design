/**
 * @desc 方法名称：全局节流调用
 * @param {Function} [fn] - 需要节流执行的函数
 * @param {Number} [delay] - 节流执行闭锁时间，默认1000ms
 */
function throttle(fn, delay = 1000) {
  //定时器方法节流（还可以使用时间戳方法)(节流的方法写的比较简单，参照防抖其实实现原理相似，后续有时间再展开描述)
  let timer = null
  return function () {
    const context = this
    let args = arguments
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, args)
        clearTimeout(timer)
        timer = null
      }, delay)
    }
  }
}
