// 添加规则 给当前所有的标签都添加上id
export default (md) => {
  md.core.ruler.push('show-line', (state) => {
    // forEach 遍历 tokens
    state.tokens.forEach(token => {
      // token.map 即所在的行数
      if (token.map && (token.tag === 'h2' || token.tag === 'h3')) {
        // 起始行
        const id = ["id", 'toc-head-' + token.map[0].toString()]
        // 初始化属性
        token.attrs = token.attrs || []
        // 添加属性
        token.attrs.push(id)
      }
    })
    return true;
  });
}