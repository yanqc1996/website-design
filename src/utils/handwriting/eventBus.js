// 简易eventBus
// 1.订阅事件on 2.触发事件emit 3.移除事件off

class EventBus {
  constructor() {
    this.eventContainer = this.eventContainer || new Map() //用一个容器存放事件
  }
  on(type, callback) {
    if (!this.eventContainer.has(type)) {
      //如果容器里面没有这种类型的事件，就增加
      this.eventContainer.set(type, callback)
    }
  }
  off(type) {
    if (this.eventContainer.has(type)) {
      this.eventContainer.delete(type)
    }
  }
  emit(type) {
    let fn = this.eventContainer.get(type)
    fn.apply(this, [...arguments].slice(1))
  }
}

let ev = new EventBus()
ev.on('testEvent', (name) => {
  console.log('hello,', name)
})
ev.emit('testEvent', 'jack')
