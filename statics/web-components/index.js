// 自定义元素（custom element）=> 自定义元素的名称必须包含连词线，用与区别原生的 HTML 元素
class UserCard extends HTMLElement {
  // 继承父类HTMLElement特性
  constructor() {
    super()
    // 表示 Shadow DOM 是封闭的，不允许外部访问
    var shadow = this.attachShadow({ mode: 'closed' })
    // 基于template为自定义元素加载节点
    var templateElem = document.getElementById('userCardTemplate')
    // clone，避免其他模板影响
    var content = templateElem.content.cloneNode(true)
    content.querySelector('img').setAttribute('src', this.getAttribute('image'))
    content.querySelector('.container>.name').innerText = this.getAttribute('name')
    content.querySelector('.container>.email').innerText = this.getAttribute('email')

    shadow.appendChild(content)
  }
}
// 告诉浏览器<user-card></user-card>元素关联UserCard类
window.customElements.define('user-card', UserCard)
