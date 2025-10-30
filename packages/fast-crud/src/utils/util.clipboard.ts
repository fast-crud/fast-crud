/**
 * 使用传统execCommand方法复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {boolean} 复制是否成功
 */
function copyToClipboardTraditional(text) {
  // 创建临时textarea元素
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // 设置样式避免影响页面布局
  textArea.style.position = "fixed";
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.opacity = "0";
  textArea.style.pointerEvents = "none";
  textArea.style.zIndex = "-1";

  // 添加到DOM中
  document.body.appendChild(textArea);

  try {
    // 选择文本并执行复制命令
    textArea.select();
    textArea.setSelectionRange(0, 99999); // 移动设备支持

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);

    if (successful) {
      console.log("文本已成功复制到剪贴板（传统方法）");
      return true;
    } else {
      console.error("传统复制方法失败");
      return false;
    }
  } catch (err) {
    console.error("传统复制方法出错: ", err);
    document.body.removeChild(textArea);
    return false;
  }
}
/**
 * 使用现代Clipboard API复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} 复制是否成功
 */
export async function copyToClipboard(text) {
  try {
    // 检查浏览器是否支持Clipboard API
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      console.warn("Clipboard API not supported, falling back to traditional method");
      return copyToClipboardTraditional(text);
    }

    await navigator.clipboard.writeText(text);
    console.log("文本已成功复制到剪贴板");
    return true;
  } catch (err) {
    console.error("复制失败: ", err);
    // 如果现代API失败，回退到传统方法
    return copyToClipboardTraditional(text);
  }
}

/**
 * 尝试使用传统方法读取剪贴板（仅在某些浏览器中有效）
 * @returns {Promise<string>} 剪贴板中的文本内容
 */
async function readFromClipboardTraditional(): Promise<string> {
  return new Promise((resolve, reject) => {
    // 创建临时textarea元素
    const textArea = document.createElement("textarea");
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);

    try {
      // 聚焦并尝试粘贴
      textArea.focus();
      const successful = document.execCommand("paste");

      if (successful) {
        const text = textArea.value;
        document.body.removeChild(textArea);
        console.log("剪贴板内容已读取（传统方法）");
        resolve(text);
      } else {
        document.body.removeChild(textArea);
        reject(new Error("传统读取方法失败"));
      }
    } finally {
      document.body.removeChild(textArea);
    }
  });
}

/**
 * 使用现代Clipboard API读取剪贴板文本
 * @returns {Promise<string>} 剪贴板中的文本内容
 */
export async function readToClipboard(): Promise<string> {
  try {
    // 检查浏览器是否支持Clipboard API
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      console.warn("Clipboard API not supported for reading");
      throw new Error("浏览器不支持读取剪贴板");
    }

    // 请求剪贴板读取权限
    if (navigator.permissions) {
      const permission = await navigator.permissions.query({ name: "clipboard-read" });
      if (permission.state === "denied") {
        throw new Error("剪贴板读取权限被拒绝");
      }
    }

    const text = await navigator.clipboard.readText();
    console.log("剪贴板内容已读取");
    return text;
  } catch (err) {
    console.error("读取剪贴板失败: ", err);
    return await readFromClipboardTraditional();
  }
}
