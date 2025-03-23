import { useLogger } from 'reactive-vscode'
import * as vscode from 'vscode'
import { displayName } from './generated/meta'

export const logger = useLogger(displayName)

const _default = 'https://jex.im/regulex/'
export function generateUrl(text: string, url: string) {
  const config = vscode.workspace.getConfiguration('regexp-visualizer')
  const _url = config.get('url', _default)
  if (_url === _default) {
    const flags = text.match(/\/([gimuy]*)$/)?.[1] || ''
    text = text.replace(/^\/|\/[gimuy]*$/g, '').replace(/^\/|\/$/, '')
    text = encodeURIComponent(text)
    url = `https://jex.im/regulex/#!flags=${flags}&re=${text}`
  }
  else {
    url = `${_url}?r=${encodeURIComponent(text)}`
  }
  return url
}
