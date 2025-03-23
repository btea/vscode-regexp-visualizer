import { defineExtension } from 'reactive-vscode'
import * as vscode from 'vscode'

const { activate, deactivate } = defineExtension((context) => {
  const disposable = vscode.commands.registerCommand('regexp-visualizer.show', () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      return
    }
    const selection = editor.selection
    let text = editor.document.getText(selection)
    if (!text) {
      return
    }
    const validRegex = /^\/.*\/[gimuy]*$/
    if (!validRegex.test(text)) {
      vscode.window.showErrorMessage('Invalid regex')
      return
    }
    const panel = vscode.window.createWebviewPanel(
      'regexVisualizer',
      'Regex Visualizer',
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      },
    )

    const flags = text.match(/\/([gimuy]*)$/)?.[1] || ''
    text = text.replace(/^\/|\/[gimuy]*$/g, '').replace(/^\/|\/$/, '')
    text = encodeURIComponent(text)
    const url = `https://jex.im/regulex/#!flags=${flags}&re=${text}`
    const str = `
<html>
  <head>
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src vscode-resource: 'unsafe-inline'; style-src vscode-resource: 'unsafe-inline'; frame-src https:;">
  </head>
  <body style="height: 100vh; margin: 0; padding: 0;">
    <iframe src="${url}" style="width: 100%; height: 100%; border: none;"></iframe>
  </body>
</html>
`
    panel.webview.html = str
  })

  context.subscriptions.push(disposable)
})

export { activate, deactivate }
