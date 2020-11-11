/**
 * @Description:
 * @Author: Wan.Jiang
 * @Date: 2020-11-10
 **/
import network from './httpRequest';

// 第二步：校验文件的MD5
export function checkFileMD5(params) {
  return network({
    url: '/check/file',
    params
  });
}

export function uploadPic(params) {
  return network({
    url: '/upload',
    method: "post",
    data: params,
    async: true, //异步
    processData: false, //很重要，告诉jquery不要对form进行处理
    contentType: false, //很重要，指定为false才能形成正确的Content-Type
  });
}

export function finishUpload(params) {
  return network({
    url: '/merge',
    method: 'get',
    params
  });
}
