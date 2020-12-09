const { app, BrowserWindow, Menu } = require("electron") //引入electron

let mainWindow = null

app.on("ready",()=>{

  Menu.setApplicationMenu(null)
  mainWindow = new BrowserWindow({
    width:800, //窗口宽度
    height:800, //窗口宽度
    center:true, //是否在屏幕居中
    title:"PM2_APP", //窗口标题
    webPreferences:{
      javascript: true,
      plugins: true,
      nodeIntegration: true, // 是否集成 Nodejs
      webSecurity: false,
    }
  })
  mainWindow.webContents.openDevTools()
  mainWindow.loadFile("index.html") //设置窗体加载html文件名
  app.on("close",()=>{
      mainWindow = null  //选择窗口关闭时关闭主进程
  })
})