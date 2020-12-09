class AddServe extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({mode: 'open'})
    const template = document.getElementById('add-serve')
    const content = template.content.cloneNode(true)
    shadow.appendChild(content)
    shadow.querySelector('.button').addEventListener('click', this.addNew.bind(this))
  }

  addNew() {
    const ip = this.shadowRoot.querySelector('input[name="ip"]').value
    if(!ip) return alert('ip输入有误')
    testlink(ip, () => {
      this.shadowRoot.querySelector('input[name="ip"]').value = ''
    })
  }
}

customElements.define('add-serve', AddServe)

class GlobalMask extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({mode: 'open'})
    const templateElem = document.getElementById('global-mask')
    const content = templateElem.content.cloneNode(true)

    shadow.appendChild(content)
  }
}
customElements.define('global-mask', GlobalMask)

class ServeBlock extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({mode: 'open'})
    const templateElem = document.getElementById('pm2-serve')
    const content = templateElem.content.cloneNode(true)

    shadow.appendChild(content)
  }

  link = () => {
    const ip = this.querySelector('span').innerText
    login(ip)
  }
  del = () => {
    this.parentNode.replaceChild(this)
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.linkServe').addEventListener('click', this.link.bind(this))
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector('.linkServe').removeEventListener('click', this.link)
  }
}
customElements.define('pm2-serve', ServeBlock)