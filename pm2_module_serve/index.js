const pmx = require('pmx')
const pm2 = require('pm2')
const getRawBody = require('raw-body')

const http = require('http')
const server = http.createServer()

const port = 20210

server.on('request', function (req, res) {
  console.log('收到请求了，请求路径是：' + req.url)
  console.log('请求我的客户端的地址是：', req.socket.remoteAddress, req.socket.remotePort)
  
  getRawBody(req)
    .then(function (buf) {
      const str = buf.toString('utf8') 
      req.body = str ? getBody(str) : {}

      router(req, res)
    })
    .catch(function (err) {
      res.statusCode = 500
      res.end(err.message)
    })
})
const getBody = (str) => {
  let obj = {}
  str.split('&').forEach(d => {
    const data = d.split('=')
    obj[data[0]] = data[1]
  })
  return obj
}  

const router = (req, res) => {
  const { url, method, body } = req
  // if(method.toUpperCase() !== 'PUT') return res.end()

  res.setHeader('Content-Type', 'application/json')
 
  switch(url) {
    case '/login': return login(res)
    case '/list': return list(res)
    case '/start': return start(body, res)
    case '/stop': return stop(body, res)
    case '/restart': return restart(body, res)
    case '/del': return del(body, res)
    case '/ping': {
      res.setHeader('Content-Type', 'application/text')
      return res.end('pong')
    }
    default: return res.end()
  }
}

// 登录
const login = (res) => {
  pm2.connect(err => {
    let returnValue = {
      success: true,
      data: '成功'
    }
    if(err) returnValue = {
      success: false,
      data: '失败'
    }
    
    res.end(JSON.stringify(returnValue))
  })
}
// 获取列表
const list = (res) => {
  pm2.list((err, list) => {
    let returnValue = {
      success: false,
      msg: '失败'
    }
    if (err) return res.end(JSON.stringify(returnValue))
    returnValue = {
      success: true,
      data: list
    }
    return res.end(JSON.stringify(returnValue))
  }) 
}
// 启动 不包括新建
const start = ({ name }, res) => {
  if (!name) return res.end(JSON.stringify({success: false, data: '数据错误'}))
  pm2.start(name, (err) => {
    if (err) {
      console.log(err)
      return res.end(JSON.stringify({success: false, data: '失败'}))
    }
    list(res)
  })
}
// 停止 
const stop = ({ name }, res) => {
  if (!name) return res.end(JSON.stringify({success: false, data: '数据错误'}))
  pm2.stop(name, (err) => {
    if (err) {
      console.log(err)
      return res.end(JSON.stringify({success: false, data: '失败'}))
    }
    list(res)
  })
}
// 重启
const restart = ({ name }, res) => {
  if (!name) return res.end(JSON.stringify({success: false, data: '数据错误'}))
  pm2.restart(name, (err) => {
    if (err) {
      console.log(err)
      return res.end(JSON.stringify({success: false, data: '失败'}))
    }
    list(res)
  })
}
// 删除
const del = ({ name }, res) => {
  if (!name) return res.end(JSON.stringify({success: false, data: '数据错误'}))
  pm2.delete(name, (err) => {
    if (err) {
      console.log(err)
      return res.end(JSON.stringify({success: false, data: '失败'}))
    }
    list(res)
  })
}
server.listen(port)

var conf = pmx.initModule({
  widget : {
    type             : 'generic',
    logo             : 'https://raw.githubusercontent.com/pm2-hive/pm2-logrotate/master/pres/logo.png',
    theme            : ['#111111', '#1B2228', '#31C2F1', '#807C7C'],
    el : {
      probes  : false,
      actions : false
    },
    block : {
      issues  : true,
      cpu: true,
      mem: true,
      actions : true,
      main_probes : ['Global logs size', 'Files count']
    }
  }
});

console.log('server is running ' + port); 