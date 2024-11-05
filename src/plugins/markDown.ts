import '@kangc/v-md-editor/lib/style/base-editor.css';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
import '@/style/essay.css'

/* ------------Markdown-------------- */
import VueMarkdownEditor from '@kangc/v-md-editor';

import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';

import hljsVuePlugin from '@highlightjs/vue-plugin';
// 引入prismjs
import Prism from 'prismjs';
//插入自定义文本
import container from 'markdown-it-container'
//标记
import mark from 'markdown-it-mark'
//markdown内部注释（好像屁用没有）用法：<!-- comments -->
import inlineComments from 'markdown-it-inline-comments'
//markdown内部注释（好像屁用没有）用法：<!-- comments -->
import bracketedSpans from 'markdown-it-bracketed-spans'



//表情包
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';

//LineNumber 高亮代码行号
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
//Align 内容定位 可以引入 align 插件来支持设置内容的水平位置：
import createAlignPlugin from '@kangc/v-md-editor/lib/plugins/align';
//可以给当前标记添加各种属性,类似与jQuery的attr 点击查看参考
import markdownItAttrs from 'markdown-it-attrs'
//

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
  extend(md) {

    md.use(mark)
      .use(inlineComments)
      .use(bracketedSpans)
      .use(markdownItAttrs, {
        // optional, these are default options
        leftDelimiter: '{',
        rightDelimiter: '}',
        allowedAttributes: []  // empty array = all attributes are allowed
      })
      .use(container, 'spoiler', {
        validate: function (params) {
          return params.trim().match(/^spoiler\s+(.*)$/);
        },
        render: function (tokens, idx) {
          var m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);
          if (tokens[idx].nesting === 1) {
            // opening tag
            return '<details><summary>' + md.utils.escapeHtml(m[1]) + '</summary>\n';
          } else {
            // closing tag
            return '</details>\n';
          }
        }
      })
    // 添加规则 给当前所有的标签都添加上id
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



    md.core.ruler.push('music', function replace(state) {

      //实现了导入音乐播放器(((:路径不要带https:)))
      return '出了点问题，暂时停用'
      if (state.tokens) {
        state.tokens.forEach(token => {
          if (token.children) {
            token.children.forEach((child, index) => {
              const lent = child.content//.split(':')
              const pat = /^[(]{1}/
              console.log(pat.test(lent[0]))
              if (lent.length <= 1) return
              token.children.splice(0, 1)
              token.children.push({
                attrs: [['src', lent[1]], ['controls', true]],
                block: false,
                children: null,
                content: '',
                hidden: false,
                info: "",
                level: 0,
                map: null,
                markup: "(((:",
                meta: null,
                nesting: 0,
                tag: "audio",
                type: "audio_open",
              }, {
                attrs: null,
                block: false,
                children: null,
                content: '',
                hidden: false,
                info: "",
                level: 0,
                map: null,
                markup: "",
                meta: null,
                nesting: -1,
                tag: "",
                type: "text",
              }, {
                attrs: null,
                block: false,
                children: null,
                content: '',
                hidden: false,
                info: "",
                level: 0,
                map: null,
                markup: ":)))",
                meta: null,
                nesting: -1,
                tag: "audio",
                type: "audio_close",
              })
            })
          }
        });
      }
    });
  }
}).use(createEmojiPlugin())
  .use(createLineNumbertPlugin())
  .use(createCopyCodePlugin())
  .use(createAlignPlugin());



const addTagAction = (editor, className: string) => {
  editor.insert(function (selected) {
    const prefix = '==';
    const suffix = `=={.${className}}`;
    const placeholder = '请输入文本';
    const content = selected || placeholder;
    return {
      text: `${prefix}${content}${suffix}`,
      selected: content,
    };
  });
}

const addTagMenu = [
  {
    text: 'gray',
    action(editor) {
      addTagAction(editor, 'gray');
    },
  },
  {
    text: 'theme',
    action(editor) {
      addTagAction(editor, 'theme');
    },
  },
  {
    text: 'black',
    action(editor) {
      addTagAction(editor, 'black');
    },
  },
  {
    text: 'white',
    action(editor) {
      addTagAction(editor, 'white');
    },
  },
  {
    text: 'pink',
    action(editor) {
      addTagAction(editor, 'pink');
    },
  },

]
export const orderTool = `emoji undo redo clear |h bold italic strikethrough quote addTag  mark |left center right ul ol table hr | link image code tip music| save tips`;


export const toolbar = {
  addTag: {
    title: '添加标记',
    icon: 'iconfont icon-bg-color',
    menus: {
      mode: 'panel',
      itemWidth: '56px',
      rowNum: 5,
      items: addTagMenu,
    },
  },

  left: {
    title: '居左',
    icon: 'iconfont icon-text-align-left',
    action(editor) {
      editor.insert(function (selected) {
        const prefix = '::: align-left \n';
        const suffix = '\n:::';
        const placeholder = '请输入文本';
        const content = selected || placeholder;

        return {
          text: `${prefix}${content}${suffix}`,
          selected: content,
        };
      });
    },
  },
  center: {
    title: '居中',
    icon: 'iconfont icon-text-align-center',
    action(editor) {
      editor.insert(function (selected) {
        const prefix = '::: align-center \n';
        const suffix = '\n :::';
        const placeholder = '请输入文本';
        const content = selected || placeholder;

        return {
          text: `${prefix}${content}${suffix}`,
          selected: content,
        };
      });
    },
  },
  right: {
    title: '居右',
    icon: 'iconfont icon-text-align-right',
    action(editor) {
      editor.insert(function (selected) {
        const prefix = '::: align-right \n';
        const suffix = ' \n:::';
        const placeholder = '请输入文本';
        const content = selected || placeholder;

        return {
          text: `${prefix}\n${content}\n${suffix}`,
          selected: content,
        };
      });
    },
  },
  tips: {
    title: '提示:可以给当前标记添加各种属性,类似与jQuery的attr 点击查看参考',
    icon: 'icon-quanju_fankui',
    action(editor) {
      editor.insert(function (selected) {
        const prefix = 'F12看看我就明白了,定义特殊属性时得加data-xxxx才能添加{.lzy_class #lzy_id ';
        const suffix = ' }';
        const placeholder = ' data-lzyqq=1024327189';
        const content = selected || placeholder;

        return {
          text: `${prefix}${content}${suffix}`,
          selected: content,
        };
      });
    },
  },
  music: {
    title: '音乐',
    icon: 'iconfont icon-1_music93',
    action(editor) {
      editor.insert(function (selected) {
        const prefix = '(((:';
        const suffix = ':)))';
        const placeholder = '//m701.music.126.net/20221030170951/44e47b6cca6b689a455ff3bd0bdabcfc/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/14096479954/d772/334b/dd34/08377580c7f76289955a97a48e5c0ca1.mp3';
        const content = selected || placeholder;
        return {
          text: `${prefix}${content}${suffix}`,
          selected: content,
        };
      });
    },
  },

}




/* 切换编写html代码 */

export const openHtmlCodeEditView = () => {

}


export const setupVMdEditor = (app) => {
  app.use(hljsVuePlugin).use(VueMarkdownEditor)
}
/* ------------Markdown-------------- */
