const { contextBridge, ipcRenderer } = require('electron')
const open = require('open')
const { readdirSync, readFileSync } = require('fs')

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', (event) => {
    // const replaceText = (selector, text) => {
    //   const element = document.getElementById(selector)
    //   if (element) element.innerText = text
    // }

    // console.log(event)
  
    // for (const type of ['chrome', 'node', 'electron']) {
    //   replaceText(`${type}-version`, process.versions[type])
    // }
})

let games = []

let count = 0

window.addEventListener('ReactDOMLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  console.log("preload")

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

const epicGamesPath = 'C:/Program Files/Epic Games/'

contextBridge.exposeInMainWorld(
  "nodeApi", {
    open: async (url) => {
      console.log(`opening ${url}`)
      await open(url)
    },
    test: async () => {
      count+=1
      console.log(count)
    },
    getGames: async (limit) => {
      console.log('getgames')
      if (games.length === 0) {
        //populate
        const dir = readdirSync(epicGamesPath)
        let gameInfo = {}
        for (const folder of dir) {
          const egstore = readdirSync(`${epicGamesPath}/${folder}/.egstore`)

          let file = false
          for (const fileName of egstore) {
            if (fileName.includes('.mancpn')) {
              const file = JSON.parse(readFileSync(`${epicGamesPath}/${folder}/.egstore/${fileName}`, {encoding: 'utf-8'}))
              console.log(file)
              gameInfo[folder] = {
                namespace: file.CatalogNamespace,
                itemid: file.CatalogItemId,
                appname: file.AppName,
                uri: `${file.CatalogNamespace}:${file.CatalogItemId}:${file.AppName}`
              }
            }
          }

          if (file === false) {
            console.log('oopsies! no manifest!')
          }
        }
        
        return gameInfo
      }
      return games
    },
    refreshGames: async () => {
      games = []
    },
  }
)