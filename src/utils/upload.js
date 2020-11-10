/**
 * @Description:
 * @Author: Wan.Jiang
 * @Date: 2020-11-10
 **/
import network from './httpRequest';

// 第二步：校验文件的MD5
export function checkFileMD5(_url) {
  return network({
    url: _url
  });
}

export function uploadPic(params) {
  return network({
    url: params.url,
    method: "post",
    data: params.form,
    async: true, //异步
    processData: false, //很重要，告诉jquery不要对form进行处理
    contentType: false, //很重要，指定为false才能形成正确的Content-Type
  });
}

export function finishUpload(params) {
  return network({
    url: params
  });
}
