function SelfVue(options) {
  var that = this
  this.vm = this
  this.data1 = options.data
  //遍历所有data里的属性，通过Object.defineProperty设置get/set方法
  Object.keys(this.data1).forEach(function (key) {
    that.proxyKeys(key)
  })
  observe(this.data1)
  new Compile(options.el, this.vm) //加入这段代码
  return this
}

SelfVue.prototype = {
  proxyKeys: function (key) {
    var that = this
    Object.defineProperty(this, key, {
      enumerable: false, //定义对象的属性是否可以在 for...in 循环和 Object.keys() 中被枚举。
      configurable: true, //configurable特性表示对象的属性是否可以被删除，以及除writable特性外的其他特性是否可以被修改。
      get: function proxyGetter() {
        return that.data1[key]
      },
      set: function proxySetter(newVal) {
        that.data1[key] = newVal
      },
    })
  },
}

function observe(value, vm) {
  //数据类型为Object的进行观测
  if (!value || typeof value !== 'object') {
    return
  }
  return new Observer(value)
}

function Observer(data) {
  this.data = data
  this.walk(data)
}

Observer.prototype = {
  walk: function (data) {
    var that = this
    //遍历所有的属性
    Object.keys(data).forEach(function (key) {
      that.defineReactive(data, key, data[key])
    })
  },
  //在对象上定义一个可监听变化的数据。
  //通过defineProperty的set方法去通知notify()订阅者subscribers有新的值修改
  defineReactive: function (data, key, val) {
    var dep = new Dep()
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      set: function (newVal) {
        if (newVal === val) {
          return
        }
        val = newVal
        dep.notify() // 如果数据变化，通知所有订阅者
      },
      get: function () {
        if (Dep.target) {
          //是否添加订阅者,Watcher初始化触发
          dep.addSub(Dep.target) //添加订阅者
        }
        return val
      },
    })
  },
}

function Dep() {
  this.subs = []
}

//prototype 属性使你有能力向对象添加属性和方法
//prototype这个属性只有函数对象才有，具体的说就是构造函数具有.只要你声明定义了一个函数对象，这个prototype就会存在
//对象实例是没有这个属性
Dep.prototype = {
  addSub: function (sub) {
    this.subs.push(sub)
  },
  notify: function () {
    this.subs.forEach(function (sub) {
      sub.update() //通知每个订阅者检查更新
    })
  },
}

Dep.target = null

function Watcher(vm, exp, cb) {
  this.cb = cb //闭包
  this.vm = vm //指向SelfVue的作用域
  this.exp = exp //绑定属性的key值
  this.value = this.get() // 将自己添加到订阅器的操作
}

Watcher.prototype = {
  update: function () {
    this.run()
  },
  run: function () {
    var value = this.vm.data1[this.exp]
    var oldVal = this.value
    if (value !== oldVal) {
      this.value = value
      this.cb.call(this.vm, value, oldVal)
    }
  },
  get: function () {
    Dep.target = this // 缓存自己
    var value = this.vm.data1[this.exp] // 强制执行监听器里的get函数
    Dep.target = null // 释放自己
    return value
  },
}

function Compile(el, vm) {
  this.vm = vm
  this.el = document.querySelector(el)
  this.fragment = null
  this.init()
}

Compile.prototype = {
  init: function () {
    if (this.el) {
      this.fragment = this.nodeToFragment(this.el)
      this.compileElement(this.fragment)
      this.el.appendChild(this.fragment)
    } else {
      console.log('Dom元素不存在')
    }
  },
  //首先要获得dom元素， 然后对含有dom元素上含有指令的节点进行处理
  nodeToFragment: function (el) {
    var fragment = document.createDocumentFragment() //createdocumentfragment()方法创建了一虚拟的节点对象，节点对象包含所有属性和方法。
    var child = el.firstChild
    while (child) {
      // 将Dom元素移入fragment中
      fragment.appendChild(child)
      child = el.firstChild
    }
    return fragment
  },
  //接下来需要遍历所有节点， 对含有指令的节点进行特殊的处理， 这里我们先处理最简单的情况， 只对带有 '{{变量}}'这种形式的指令进行处理
  compileElement: function (el) {
    var childNodes = el.childNodes //childNodes属性返回节点的子节点集合，以 NodeList 对象。
    var that = this
    //slice() 方法可从已有的数组中返回选定的元素。
    ;[].slice.call(childNodes).forEach(function (node) {
      var reg = /\{\{(.*)\}\}/
      var text = node.textContent

      if (that.isTextNode(node) && reg.test(text)) {
        // 判断是否是符合这种形式{{}}的指令
        //exec() 方法用于检索字符串中的正则表达式的匹配。
        //返回一个数组，其中存放匹配的结果。如果未找到匹配，则返回值为 null。
        that.compileText(node, reg.exec(text)[1])
      }

      if (node.childNodes && node.childNodes.length) {
        that.compileElement(node) // 继续递归遍历子节点
      }
    })
  },
  compileText: function (node, exp) {
    var that = this
    var initText = this.vm[exp]
    this.updateText(node, initText) // 将初始化的数据初始化到视图中
    new Watcher(this.vm, exp, function (value) {
      // 生成订阅器并绑定更新函数
      that.updateText(node, value)
    })
  },
  updateText: function (node, value) {
    node.textContent = typeof value == 'undefined' ? '' : value
  },
  isTextNode: function (node) {
    return node.nodeType == 3
  },
}
