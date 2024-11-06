
/* 生成随机密码(难度指数 1-5) 函数 */
export function randomPassword(difficulty: number) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";

  for (let i = 0; i < difficulty; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars.charAt(randomIndex);
  }
  return password;
}

// 驼峰转下划线的函数
function camelToSnake(key) {
  return key.replace(/([A-Z])/g, '_$1').toLowerCase();
}

// 递归处理 JSON 对象的函数，遍历所有键
export function convertKeysToSnakeCase(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToSnakeCase(item));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = camelToSnake(key);
      acc[snakeKey] = convertKeysToSnakeCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

/**
 * 将代理对象转换为普通对象
 *
 * @param obj 要转换的代理对象
 * @returns 转换后的普通对象
 */
export function toProxys(obj: any): any {
  // 如果obj不是对象，则直接返回
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // 初始化结果对象
  let result: any = {};

  // 遍历obj的每个键值对
  for (const key in obj) {
    const value = obj[key];

    // 如果键对应的值是数组
    if (Array.isArray(value)) {
      // 使用展开运算符创建数组的深拷贝
      result[key] = [...value];

      // 如果键对应的值是对象
    } else if (value && typeof value === 'object' && value !== null) {
      // 递归调用toProxys函数转换对象
      result[key] = toProxys(value);

      // 否则直接将值赋值给结果对象
    } else {
      result[key] = value;
    }
  }

  // 返回转换后的结果对象
  return result;
}

/**
 * 比较两个对象是否相等
 *
 * @param obj 要比较的第一个对象
 * @param other 要比较的第二个对象
 * @param keepNeededValue 需要保留的值
 * @param newResult 用来存储比较结果的空对象
 * @returns 比较结果对象，如果两个对象相等，则返回空对象，否则返回包含差异的键值对
 */
export function isEqual(obj: object, other: object, keepNeededValue: string[] | string, newResult: object = {}): any {

  // 遍历第一个对象的每个键
  for (const key in obj) {
    // 如果需要保留的值是字符串，转换为数组
    if (typeof keepNeededValue === 'string') {
      keepNeededValue = [keepNeededValue]
    }
    // 如果需要保留的值存在
    if (obj.hasOwnProperty(key) && keepNeededValue.includes(key)) {
      newResult[key] = obj[key]
      continue
    }

    // 如果键对应的值是数组
    if (obj[key] instanceof Array && other[key] instanceof Array) {
      // 递归比较两个数组
      newResult[key] = obj[key].filter((item, index) => item !== other[key][index])
      // 如果键对应的值是对象
    } else if (obj[key] instanceof Object && other[key] instanceof Object) {
      // 递归比较两个对象
      newResult = isEqual(obj[key], other[key], keepNeededValue, newResult)

      // 如果两个键对应的值不相等
    } else if (obj[key] !== other[key]) {
      // 将差异的键值对添加到结果对象中
      newResult[key] = obj[key]
    }
  }

  // 返回比较结果对象
  return newResult
}


/**
 * 将base64编码的字符串转换为Blob对象
 * @param {string} dataurl - base64编码的字符串
 * @returns {Blob} - 转换后的Blob对象
 */
export function base64toBlob(dataurl) {
  // base64 转 二进制流(blob)
  let arr = dataurl.split(","), // 将base64编码的字符串按逗号分割成数组
    mime = arr[0].match(/:(.*?);/)[1], // 提取MIME类型
    bstr = atob(arr[1]), // 将base64编码的字符串解码为二进制流
    n = bstr.length, // 二进制流的长度
    u8arr = new Uint8Array(n); // 创建一个指定长度的无符号8位整数数组
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n); // 将二进制流的每个字节转换为无符号8位整数并存入数组
  }
  return new Blob([u8arr], {
    type: mime, // 设置Blob对象的MIME类型
  });
}

/* 将文件转换为base64 */
export function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

// 二进制流转换为base64 格式。
export function getBase64Binary(data, type) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([data], { type: type }); // 必须指定type类型
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * 压缩图片 
 * @param file - 图片文件
 * @param quality - 压缩质量 0-1之间  值越小压缩的越大 图片质量越差
 * @returns Promise对象，包含base64格式的压缩图片和压缩后的文件对象
 */
export function optimizeImage(file, quality): Promise<{ base64: string, fileCompress: Blob }> {
  return new Promise((resolve, reject) => {
    getBase64Binary(file, file.type).then((res: string) => {
      const canvas = document.createElement("canvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");
      let img = new Image() as any;
      img.src = res;
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx!.drawImage(img, 0, 0, img.width, img.height);
        const base64 = canvas.toDataURL(file.type, quality);
        const fileCompress = base64toBlob(base64);
        resolve({ base64, fileCompress });
        // 清理图片对象，释放内存
        img.onload = img.onerror = null; // 移除事件监听器
        img.src = ""; // 清空 src 属性，解除图片的引用
        img = null; // 将 img 对象设为 null
      };
      img.onerror = function () {
        // 清理图片对象
        img.onload = img.onerror = null;
        img.src = "";
        img = null;
        reject(new Error('图片加载失败'));
      };
    });
  });
}