/**
 * @Description:
 * @Author: Wan.Jiang
 * @Date: 2020-10-26
 **/
export function validEmail(val) {
  return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(val);
}

export function validPhone(val) {
  return /^1[3456789]\d{9}$/.test(val);
}

export function validPass(val) {
  return /^[a-zA-Z\d]{8,20}$/.test(val);
  // return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(val);
  // return /^.{6,16}$/.test(val);
}

export function validUserName(name) {
  return validEmail(name) || validPhone(name);
}

export function validCode(val) {
  return /^[0-9]{6}$/.test(val);
}

export function userName(str) {
  const re = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
  return re.test(str);
}

export function validateMainName2(name) {
  const re = /^[a-zA-Z0-9_-]{1,19}$/
  return re.test(name);
}

export function validateNickName(name) {
  const re = /^[a-zA-Z0-9\u4E00-\u9FA5]{2,10}$/
  return re.test(name);
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
export function formatDate(value) {
  if (!value) {
    return null;
  }
  let d = new Date(value);
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  return  [year, month, day].map(formatNumber).join('-');
}

export function formatTime(value) {
  if (!value) {
    return '';
  }
  let d = new Date(value);
  // let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = formatNumber(d.getDate());
  let hour = formatNumber(d.getHours());
  // let minutes = formatNumber(d.getMinutes());
  // let seconds = formatNumber(d.getSeconds());
  return  month + '月' + day + '日' + ' ' + hour + '时';
}

export function formatHour(value) {

  let d = new Date(value);
  let hour = d.getHours();
  return  !value ? '' : formatNumber(hour);
}

export function timeFromNow(value) {
  let currentDate = Date.now();
  let timestamp = currentDate - value;
  switch (true) {
    case timestamp > 86400000:
      return `${Math.floor(timestamp / 86400000)}天前`
      // eslint-disable-next-line no-unreachable
      break;
    case timestamp > 3600000:
      return `${Math.floor(timestamp / 3600000)}小时前`
      // eslint-disable-next-line no-unreachable
      break;
    case timestamp > 60000:
      return `${Math.floor(timestamp / 60000)}分钟前`
      // eslint-disable-next-line no-unreachable
      break;
    case timestamp > 1000:
      return `${Math.floor(timestamp / 1000)}秒钟前`
      // eslint-disable-next-line no-unreachable
      break;
  }
}


export default {
  validEmail,
  validPhone,
  validUserName,
  validCode,
  validPass,
  userName,
  validateMainName2,
  validateNickName,
  formatDate,
  timeFromNow,
  formatHour
}
