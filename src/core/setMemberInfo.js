const { errCodeMap } = require('../util/errCode');
const axios = require('axios');
const { URL } = require('../polyfill/URL');
const errorHandler = require('../util/errorHandler');
const path = require('path');
const { isBrowserEnv } = require('../util/isBrowserEnv');
const locationStr = !isBrowserEnv() ? `core.${path.basename(__filename, path.extname(__filename))}` : 'borwser';

/**
 * @description 设置群成员信息
 * @param {string} baseUrl      mirai-api-http server 的地址
 * @param {string} sessionKey   会话标识
 * @param {number} target       群成员所在群号
 * @param {number} memberId     群成员的 qq 号
 * @param {string} name         要设置的群名片
 * @param {string} specialTitle 要设置的群头衔
 * @returns {Object} 结构 { message, code }
 */
module.exports = async ({ baseUrl, sessionKey, target, memberId, name, specialTitle }) => {
    try {
        // 拼接 url
        const url = new URL('/memberInfo', baseUrl).toString();

        // 请求
        const responseData = await axios.post(url, {
            sessionKey, target, memberId,
            info: {
                name, specialTitle,
            }
        });
        try {
            var {
                data: { msg: message, code }
            } = responseData;
        } catch (error) {
            throw new Error(('请求返回格式出错，请检查 mirai-console'));
        }
        // 抛出 mirai 的异常，到 catch 中处理后再抛出
        if (code in errCodeMap) {
            throw new Error(message);
        }
        return { message, code };
    } catch (error) {
        console.error(`mirai-js: error ${locationStr}`);
        errorHandler(error);
    }

};