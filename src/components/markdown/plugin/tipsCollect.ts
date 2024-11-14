import markdownItContainer from "markdown-it-container"; // 折叠面板

export default (md) => {

  const tips = [{
    title: "tip",
    icon: "tip",
  }, {
    title: "info",
    icon: "info",
  }, {
    title: "warning",
    icon: "warning",
  }, {
    title: "danger",
    icon: "danger",
  }, {
    title: "success",
    icon: "success",
  }, {
    title: "note",
    icon: "note",
  }, {
    title: "attention",
    icon: "attention",
  }, {
    title: "caution",
    icon: "caution",
  }]

  md.use(markdownItContainer, "fold", {
    validate: function (params) {
      return params.trim().match(/^fold\s+(.*)$/);
    },

    render: function (tokens, idx) {
      var m = tokens[idx].info.trim().match(/^fold\s+(.*)$/);

      if (tokens[idx].nesting === 1) {
        // opening tag
        return "<details><summary>" + md.utils.escapeHtml(m[1]) + "</summary>\n";
      } else {
        // closing tag
        return "</details>\n";
      }
    },
  })

  tips.forEach(item => {
    md.use(markdownItContainer, item.title, {
      validate: function (params) {
        const regex = new RegExp(`^${item.title}\\s+(.*)$`);
        return params.trim().match(regex);
      },
      render: function (tokens, idx) {
        const regex = new RegExp(`^${item.title}\\s+(.*)$`);
        var m = tokens[idx].info.trim().match(regex);

        if (tokens[idx].nesting === 1) {
          // opening tag
          return `<div class='markdown-plugin-tip ${item.title}'>
            <p class='markdown-tip-title'>${md.utils.escapeHtml(m[1])}</p>
          \n`;
        } else {
          // closing tag
          return "</div>\n";
        }


        // if (tokens[idx].nesting === 1) {
        //   return `<div  ${item.title}">
        //     <p class="markdown-plugin-tip-title">${item.title}</p>
        //     <div class="content">在此输入内容</div>
        //   `
        // } else {
        //   return `</div>`
        // }
      }
    })
  })


}