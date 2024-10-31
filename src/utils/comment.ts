/* 将文件转换为base64 */
export function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
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