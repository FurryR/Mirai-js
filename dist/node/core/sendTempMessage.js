"use strict";

const {
  errCodeMap
} = require('../util/errCode');

const axios = require('axios').default;

const {
  URL
} = require('../polyfill/URL');

const errorHandler = require('../util/errorHandler');

const path = require('path');

const {
  isBrowserEnv
} = require('../util/isBrowserEnv');

const locationStr = !isBrowserEnv() ? `core.${path.basename(__filename, path.extname(__filename))}` : 'borwser';
/**
 * @description 向临时对象发送消息
 * @param {string}             baseUrl      mirai-api-http server 的地址
 * @param {string}             sessionKey   会话标识
 * @param {number}             qq           目标 qq 号
 * @param {number}             group        目标群号
 * @param {number}             quote        消息引用，使用发送时返回的 messageId
 * @param {MessageType[]} messageChain 消息链，MessageType 数组
 * @returns {Object} 结构 { message, code, messageId }
 */

module.exports = async ({
  baseUrl,
  sessionKey,
  qq,
  group,
  quote,
  messageChain
}) => {
  try {
    // 拼接 url
    const url = new URL('/sendTempMessage', baseUrl).toString();

    if (!qq || !group) {
      throw new Error('sendTempMessage 缺少必要的 qq 和 group 参数');
    } // 请求


    const responseData = await axios.post(url, {
      sessionKey,
      qq,
      group,
      quote,
      messageChain
    });

    try {
      var {
        data: {
          msg: message,
          code,
          messageId
        }
      } = responseData;
    } catch (error) {
      throw new Error('请求返回格式出错，请检查 mirai-console');
    } // 抛出 mirai 的异常，到 catch 中处理后再抛出


    if (code in errCodeMap) {
      throw new Error(message);
    }

    return messageId;
  } catch (error) {
    console.error(`mirai-js: error ${locationStr}`);
    errorHandler(error);
  }
};