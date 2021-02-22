const fs = require('fs')
const path = require('path')
const packageJson = require('../package.json')
const { description } = packageJson

const protos = fs.readdirSync('./src').filter(
  item => item.indexOf('proto-') > -1
)
protos.reverse()

const linksList = protos.map((item) => {
  const title = item.replace(/-/gi, ' / ')
  let txt = ''
  const infoPath = path.join(__dirname, '../src', item, 'info.txt')

  if (fs.existsSync(infoPath)) {
    // Inject info for the current prototype folder
    let info = fs.readFileSync(infoPath)
    info = String(info).replace(/\n/gi, '<br />')
    txt += `<div class="info">${info}</div>`
  }

  return `<li><a href="${item}.html" title="click to view - ${title}"><div class="title">${title}</div>${txt}</a></li>`
})

// TODO: Convert this into a proper template
const tpl = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>${description}</title>
    <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1">
    <link href="https://fonts.googleapis.com/css?family=Roboto+Mono:300,400,700" rel="stylesheet" type="text/css">
    <style>
      html, body, ul, li, div, h2, a {
        margin: 0;
        padding: 0;
      }

      html, body {
        font: 14px/1.5em "Roboto Mono", monospace;
      }

      h2 {
        font-weight: 300;
        line-height: 2rem;
        padding: 1em 0 1em 2em;
      }

      ul {
        list-style-type: none;
      }

      a {
        align-items: strech;
        border-bottom: 1px solid #eee;
        display: flex;
        flex-direction: row;
        font-size: 1rem;
        min-width: 100%;
        padding: 0.25rem 0;
        text-decoration: none;
        transition: all 0.25s cubic-bezier(.44,.01,.5,.95);
        -webkit-transition: all 0.25s cubic-bezier(.44,.01,.5,.95);
        -moz-transition: all 0.25s cubic-bezier(.44,.01,.5,.95);
        -ms-transition: all 0.25s cubic-bezier(.44,.01,.5,.95);
      }

      a, a:visited {
        color: #333;
      }

      a:hover {
        background: #f2f2f2;
        color: #000;
        padding-left: 12px;
      }

      a:hover .title {
        color: rgb(215, 40, 158);
      }

      a .title {
        border-right: 1px solid #555;
        padding: 0 3rem;
      }

      a .info {
        color: rgb(44, 177, 215);
        padding: 0 3rem;
      }

      @media (max-width: 768px) {
        h2 {
          padding: 2rem 1rem;
        }

        a {
          flex-direction: column;
        }

        a .title {
          border-right: none;
          border-bottom: 1px solid #555;
          font-size: 1.25rem;
          padding: 1rem 2rem;
        }

        a .info {
          padding: 1rem 2rem;
        }

        a:hover {
          padding-left: 0;
        }
      }
    </style>
  </head>
  <body>
    <h2>${description}</h2>
    <ul>${linksList.join('')}</ul>
  </body>
</html>
`

if (!fs.existsSync('./docs')) {
  fs.mkdirSync('./docs')
  console.log('Created ./docs folder')
}

fs.writeFile('docs/index.html', tpl, 'utf-8', (e) => {
  if (e) {
    console.log('error', e)
    return
  }
  console.log('docs/index.html file created')
})
