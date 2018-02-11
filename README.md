# Text-Sensitivity

> 敏感词汇检测系统

## 介绍

整合来自阿里云和腾讯云两大敏感词汇检测 API ，检测词汇采用双锁机制，当两大 API 均认为输入词汇是正常词汇时，才认定为正常词汇。

## 配置与使用

```bash
npm install uuid qcloudapi-sdk --save
```

安装依赖后，需在 config.json 文件正确配置阿里云和腾讯云的 API 密钥。

本工具使用 Promise 封装，在返回判断结果时，可通过 await 关键词获取判断结果，也可使用 Promise.then() 方法。

接受参数:
+ 词汇

输出参数：
+ 0 : 代表输入词汇为敏感词汇
+ 1 : 代表输入词汇为正常词汇

## 示例

```js
router.get('/textSensitivity', async function (req, res) {
    let order = require('url').parse(req.url, true).query.order;
    let checkResult = await require('path/to/textSensitivity/')(order);

    // 当 order 是敏感词
    if (checkResult === 0) {
        res.jsonp({'isSensitive': 1});
    }

    // 当 order 不是敏感词
    res.jsonp({'isSensitive': 0});
});
```
