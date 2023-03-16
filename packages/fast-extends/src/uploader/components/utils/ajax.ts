function getError(action: string, option: any, xhr: any) {
  let msg;
  if (xhr.response) {
    msg = `${xhr.response.error || xhr.response}`;
  } else if (xhr.responseText) {
    msg = `${xhr.responseText}`;
  } else {
    msg = `fail to post ${action} ${xhr.status}`;
  }

  const err: any = new Error(msg);
  err.status = xhr.status;
  err.method = "post";
  err.url = action;
  return err;
}

function getBody(xhr: any) {
  const text = xhr.responseText || xhr.response;
  if (!text) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

export default function upload(option: any, onSuccess: any, onError: any) {
  if (typeof XMLHttpRequest === "undefined") {
    return;
  }

  const xhr = new XMLHttpRequest();
  const action = option.action;

  xhr.timeout = option.timeout;
  if (xhr.upload) {
    xhr.upload.onprogress = function progress(e: any) {
      if (e.total > 0) {
        e.percent = (e.loaded / e.total) * 100;
      }
      option.onProgress(e);
    };
  }

  const formData = new FormData();

  if (option.data) {
    Object.keys(option.data).forEach((key) => {
      formData.append(key, option.data[key]);
    });
  }

  formData.append(option.name, option.file, option.file.name);

  xhr.onerror = function error(e) {
    // option.onError(e)
    onError(e);
  };

  xhr.onload = function onload() {
    if (xhr.status < 200 || xhr.status >= 300) {
      return option.onError(getError(action, option, xhr));
    }
    onSuccess(getBody(xhr));
  };

  xhr.open("post", action, true);

  if (option.withCredentials && "withCredentials" in xhr) {
    xhr.withCredentials = true;
  }

  const headers = option.headers || {};

  for (const item in headers) {
    // eslint-disable-next-line no-prototype-builtins
    if (headers.hasOwnProperty(item) && headers[item] !== null) {
      xhr.setRequestHeader(item, headers[item]);
    }
  }
  xhr.send(formData);
  return xhr;
}

export function doAjax(ajaxOptions: any) {
  return new Promise((resolve, reject) => {
    upload(
      ajaxOptions,
      async (res: any) => {
        resolve(res);
      },
      (e: any) => {
        reject(e);
      }
    );
  });
}
