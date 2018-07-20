// 腾讯云文智敏感词检测API详细文档：
// https://cloud.tencent.com/document/api/271/2615

const Capi = require("qcloudapi-sdk");

function QcloudTextSensitivity(QCLOUD_ACCESS_KEY_ID, QCLOUD_ACCESS_SECRET) {
  const capi = new Capi({
    SecretId: QCLOUD_ACCESS_KEY_ID,
    SecretKey: QCLOUD_ACCESS_SECRET,
    serviceType: "wenzhi"
  });

  return check;

  function check(content) {
    const promises = [];

    // type
    // 1: 色情
    // 2: 政治
    for (let i = 1; i <= 2; i++) {
      promises.push(
        new Promise(function(resolve, reject) {
          capi.request(
            {
              Region: "gz",
              Action: "TextSensitivity",
              content,
              type: i
            },
            function(err, result) {
              if (err) {
                return reject(err);
              }

              resolve(result);
            }
          );
        })
      );
    }

    // 对 Promise 数组使用 Promise.all 方法
    return new Promise(function(resolve, reject) {
      Promise.all(promises)
        .then(function(results) {
          if (results[0].sensitive > 0.5 || results[1].sensitive > 0.5) {
            return resolve(0);
          }

          resolve(1);
        })
        .catch(function(err) {
          reject(err);
        });
    });
  }
}

module.exports = QcloudTextSensitivity;
