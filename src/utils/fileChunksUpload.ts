import { Alova } from "@/alova/api";
import { message } from "ant-design-vue";


const BASE_URL = import.meta.env.VITE_BASE_URL;


export const getFileChunks = (formData: FormData, name: string, CHUNK_SIZE_MB: number = 0.2) => {


  const file = formData.get(name) as File

  // 将 MB 转换为字节
  const chunkSizeInBytes = CHUNK_SIZE_MB * 1024 * 1024;
  let startIndex = 0 // 开始切片的索引
  let fileSize = file.size

  if (chunkSizeInBytes >= fileSize) {
    return [file]
  }


  const chunksArray: Blob[] = []

  while (fileSize >= 0) {
    // 要截取的索引长度
    const endIndex = Math.min(startIndex + chunkSizeInBytes, file.size)

    const chunk = file.slice(startIndex, endIndex)

    startIndex += chunkSizeInBytes
    fileSize -= chunkSizeInBytes
    chunksArray.push(chunk)
  }

  return chunksArray

}


/**
 * 上传文件分片到服务器
 * 
 * 该函数通过递归地向服务器发送文件分片，直到所有分片上传完毕此函数使用FormData对象封装分片数据，并根据当前分片索引设置必要的表单字段
 * 当所有分片上传完成后，服务器会返回一个完成信号，函数将此信号作为Promise的结果返回
 * 
 * @param chunksArray 文件分片数组，包含所有要上传的文件分片
 * @param formData 用于上传文件的FormData对象
 * @param name 表单字段名称，用于标识文件分片
 * @param index 当前要上传的文件分片索引，默认为0
 * @returns 返回一个Promise，当所有分片上传完成时，Promise将解析为服务器返回的完成信号
 */
export const uploadFileChunks = (chunksArray: Blob[], formData: FormData, name: string, index: number = 0) => {
  return new Promise<string>((resolve, reject) => {
    // 检查分片数组是否为空
    if (chunksArray.length === 0) {
      message.error('资源分片失败');
      return reject(new Error('Empty chunks array'));
    }

    // 验证index参数
    if (index < 0 || index >= chunksArray.length) {
      message.error('分片索引无效');
      return reject(new Error('Invalid chunk index'));
    }

    // 使用迭代代替递归
    const uploadNextChunk = async (currentIndex: number) => {
      try {
        const chunk = chunksArray[currentIndex];
        // 创建新的FormData避免副作用
        const currentFormData = new FormData();
        // 复制原始formData的所有字段
        for (const [key, value] of formData.entries()) {
          currentFormData.append(key, value);
        }
        
        currentFormData.set(name, chunk);
        currentFormData.set('completion', currentIndex === chunksArray.length - 1 ? 'true' : 'false');

        const res = await Alova.createPost("/toolkit/uploadImageToPictureBed", currentFormData).send(true);
        
        if (res.msg === 'ongoing' && currentIndex < chunksArray.length - 1) {
          // 上传下一个分片
          await uploadNextChunk(currentIndex + 1);
        } else {
          resolve(res.msg);
        }
      } catch (error) {
        message.error('上传分片失败');
        reject(error);
      }
    };

    // 开始上传
    uploadNextChunk(index);
  });
};