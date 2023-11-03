/**
 * @desc 方法名称:全局防抖调用
 * @param {Function} [func] - 需要防抖执行的函数
 * @param {Number} [wait] - 防抖执行等待时间，默认1000ms
 * @param {Boolean} [immediate] - 是否需要在函数第一次触发立即执行,默认为false
 */
function debounce(func, wait = 1000, immediate = false) {
  let timeout
  function debounced(...args) {
    //...args：传递函数的实参
    //Arguments:类数组对象，拥有一个length属性和若干索引属性的对象（类数组对象见语雀知识点小记类数组对象）
    //每个函数都会有一个Arguments对象实例arguments，它引用着函数的实参，可以用数组下标的方式”[]”引用arguments的元素。
    //arguments.length为函数实参个数，arguments.callee引用函数自身。
    let context = this
    if (timeout) clearTimeout(timeout) //清空定时器（防抖函数的核心，每次调用都清空定时器）
    if (immediate) {
      //用来判断第一次是否立即调用，第一次的时候没有定时器，因此callNow为true，否则的话则为false
      let callNow = !timeout
      timeout = setTimeout(function () {
        timeout = null
      }, wait) //wait事件后清空定时器，重置第一次的判断
      if (callNow) func.apply(context, args) //调用func方法，apply见以下apply方法
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args)
      }, wait)
    }
  }
  //设置函数的取消方法
  debounced.cancel = () => {
    clearTimeout(timeout)
    timeout = null
  }
  return debounced
}
