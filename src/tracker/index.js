/**
 * js 无埋点实现逻辑
 */
import { xpathList, TrackerList } from './constant'
var config
document.body.addEventListener(
  'click',
  function (e) {
    // 第二步：获取目标元素（这里可以过滤掉点击到 body 的脏数据）
    const el = e.target
    // 基于元素获取到xpath
    const xpath = getXPath(el)
    console.log(xpath)
    // 匹配xpath文档来实现埋点功能
    const trackerData = TrackerList.filter((item) => item.xpath === xpath)
    if (trackerData.length > 0) {
      // 解析数据
      formatTrackerData(trackerData[0].trackerData)
    } else {
      return
    }
    // 基于xpath返推到元素节点
    const ele = getElmByXPath(xpath)
    console.log(ele)
  },
  false,
)
const formatTrackerData = (data) => {
  console.log(data)
  // 这里的处理逻辑是需要完善的，这里只是先做个效果
  data.page_data.data_id = config.data_id
  data.page_data.pangu_seq_page_data_id = config.pangu_seq_page_data_id
}
// 基于点击元素获取到xpath
const getXPath = (elm) => {
  // nodeType:1-元素节点，即HTML标签 2-属性节点，元素节点的属性，id/class/name 3-元素节点/属性节点中的文本内容 8-注释节点 9-文档节点
  try {
    const allNodes = document.getElementsByTagName('*')
    console.log(allNodes)
    const xpath = []

    for (; elm && elm.nodeType === 1; elm = elm.parentNode) {
      // 遍历找到链路中id节点，无id节点则找到顶层节点
      console.log(elm)
      console.log(elm.nodeType)
      if (elm.hasAttribute('id')) {
        let uniqueIdCount = 0

        for (let n = 0; n < allNodes.length; n++) {
          // 需要保证链路id唯一,不唯一的话生成的xpath是没有用的
          if (allNodes[n].hasAttribute('id') && allNodes[n].id === elm.id) uniqueIdCount++
          if (uniqueIdCount > 1) break
        }
        if (uniqueIdCount === 1) {
          xpath.unshift('//*[@id="' + elm.getAttribute('id') + '"]')
          return xpath.join('/')
        } else {
          return false
        }
      } else {
        // 非匹配id的情况下
        let i = 1
        // previousSibling：同一树层级中指定节点的前一个节点-->获取当前节点在同级节点中的位置
        for (let sib = elm.previousSibling; sib; sib = sib.previousSibling) {
          if (sib.localName === elm.localName) i++
        }

        if (i === 1) {
          // previousSibling：同一树层级中指定节点的后一个节点
          if (elm.nextElementSibling) {
            // localName->标签名称
            if (elm.nextElementSibling.localName !== elm.localName) {
              xpath.unshift(elm.localName.toLowerCase())
            } else {
              xpath.unshift(elm.localName.toLowerCase() + '[' + i + ']')
            }
          } else {
            xpath.unshift(elm.localName.toLowerCase())
          }
        } else {
          xpath.unshift(elm.localName.toLowerCase() + '[' + i + ']')
        }
      }
    }
    return xpath.length ? '/' + xpath.join('/') : null
  } catch (err) {
    return null
  }
}

// 基于xpath反推到元素节点
const getElmByXPath = (xpath) => {
  console.log(xpath)
  if (!xpath) {
    return null
  }
  try {
    const result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null)
    return result.iterateNext()
  } catch (e) {
    console.error('getElmByXPath err is: ', e.toString())
    return null
  }
}

// 如何基于匹配的xpath实现监听元素曝光
setTimeout(() => {
  // 这个直接写会出现渲染前执行问题，暂时先写定时，后续看咋改吧

  // 基于配置xpath增加曝光属性--直接操作dom节点性能问题？
  const setViewByXPath = () => {
    xpathList.forEach((xpath) => {
      console.log(xpath)
      const ele = getElmByXPath(xpath)
      console.log(ele)
      // 这里也需要增加解析文件,解析取值逻辑
      ele && ele.setAttribute('data-view', 'view')
    })
  }
  setViewByXPath()

  // 触发曝光埋点埋点逻辑
  const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      console.log(entry)
      if (entry.intersectionRatio > 0) {
        console.log('触发埋点')
      }
    })
  })
  const nodes = document.querySelectorAll('[data-view="view"]')
  console.log(nodes)
  console.log(Array.from(nodes))
  nodes.forEach((node) => {
    console.log(node)
    intersectionObserver.observe(node)
  })
}, 500)

// 动态数据配置，基于配置文件
window.setConfig = (data) => {
  console.log(data)
  config = data
  console.log('触发函数触发函数')
}
// 元素匹配准确度问题

// 基于xpath配置自动插入埋点获取数据
