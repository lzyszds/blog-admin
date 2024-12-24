import {Plugin, ButtonView} from 'ckeditor5';

const resource = useSessionStorage<{ modal: boolean; selectImage: string, confirmImage: string }>(
    "resourceModal",
    {modal: false, selectImage: "", confirmImage: ""}
);

export default class FileManagerPlugin extends Plugin {
    init() {
        const editor = this.editor;


        // 添加工具栏按钮
        editor.ui.componentFactory.add('fileManagerdiy', locale => {
            const view = new ButtonView(locale);

            view.set({
                label: '资源文件夹',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2 11V4.6a.6.6 0 0 1 .6-.6h6.178a.6.6 0 0 1 .39.144l3.164 2.712a.6.6 0 0 0 .39.144H21.4a.6.6 0 0 1 .6.6V11M2 11v8.4a.6.6 0 0 0 .6.6h18.8a.6.6 0 0 0 .6-.6V11M2 11h20"/></svg>`, // 这里替换为你的按钮图标的 SVG 代码
                tooltip: true
            });


            // 按钮点击事件
            view.on('execute', () => {
                // 触发文件输入框的点击事件
                resource.value.modal = true;
                resource.value.confirmImage = ""
            });

            watchEffect(() => {
                if (resource.value.confirmImage) {
                    this.insertFileIntoEditor({
                        url: resource.value.confirmImage,
                        fileName: resource.value.selectImage.split("/").pop() || "",
                        fileType: "image"
                    });
                }
            });
            return view;
        });
    }


    insertFileIntoEditor(data: { url: string, fileName: string, fileType: string }) {
        const editor = this.editor;
        const selection = editor.model.document.selection;

        // 根据文件类型插入不同的 HTML
        if (data.fileType === 'image') {
            editor.model.change(writer => {
                const imageElement = writer.createElement('imageInline', {
                    src: data.url,
                    alt: data.fileName // 使用文件名作为替代文本
                });
                editor.model.insertContent(imageElement, selection);
                // 删除选择的图片 避免缓存导致下次打开时还有图片
                setTimeout(() => {
                    resource.value.confirmImage = ""
                }, 50)

            });
        } else {
            // 插入链接
            editor.model.change(writer => {
                const linkElement = writer.createText(data.fileName, {
                    linkHref: data.url
                });
                editor.model.insertContent(linkElement, selection);
            });
        }
    }
}
