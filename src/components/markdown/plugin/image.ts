import Token from 'markdown-it/lib/token'

function mdImagePlugin(md, options) {
  const { baseUrl } = options

  const defaultRender = md.renderer.rules.image || function (tokens, idx, options, _env, self) {
    return self.renderToken(tokens, idx, options)
  }


  /* 下面的内容是为了给image添加一个边框 */

  md.renderer.rules.image = function (tokens: Token[], idx: number, options, env, self) {

    const token = tokens[idx]
    const srcIndex = token.attrIndex('src')
    let src = token.attrs[srcIndex][1]
    const alt = token.content || ''
    console.log(tokens);
    token.attrs[srcIndex][1] = baseUrl + src // 更新 token 中的 src 值
    token.attrs.push(['data-fancybox', 'gallery'])
    token.attrs.push(['alt', alt])
    const imageHtml = defaultRender(tokens, idx, options, env, self)

    const wrapperHtml = `
      <div class="img-wrapper">
        ${imageHtml}
        <div class="img-pseudo" data-clipboard-text="${src.split('/').pop()}"></div>
      </div>
    `

    return wrapperHtml
  }
}

export default mdImagePlugin