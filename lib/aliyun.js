// 阿里云文本反垃圾API详细文档：
// https://help.aliyun.com/document_detail/53423.html?spm=a2c4g.11174283.3.8.Zdu4ZU

const crypto = require("crypto");
const https = require("https");
const uuidV1 = require("uuid/v1");

function AliTextSensitivity(ALI_ACCESS_KEY_ID, ALI_ACCESS_SECRET) {
  const bizCfg = {
    accessKeyId: ALI_ACCESS_KEY_ID,
    accessKeySecret: ALI_ACCESS_SECRET,
    path: "/green/text/scan",
    requestBody: null,
    hostname: "green.cn-shanghai.aliyuncs.com",
    greenVersion: "2017-01-12"
  };

  return check;

  function signature(headers, bizCfg) {
    const signature = [];

    signature.push("POST\n");
    signature.push("application/json\n");
    signature.push(headers["Content-MD5"] + "\n");
    signature.push("application/json\n");
    signature.push(headers["Date"] + "\n");
    signature.push("x-acs-signature-method:HMAC-SHA1\n");
    signature.push(
      "x-acs-signature-nonce:" + headers["x-acs-signature-nonce"] + "\n"
    );
    signature.push("x-acs-signature-version:1.0\n");
    signature.push("x-acs-version:2017-01-12\n");
    signature.push(bizCfg["path"]);

    const authorization = crypto
      .createHmac("sha1", bizCfg["accessKeySecret"])
      .update(signature.join(""))
      .digest()
      .toString("base64");

    headers.Authorization =
      "acs " + bizCfg["accessKeyId"] + ":" + authorization;
  }

  function green(bizCfg, callback) {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Content-MD5": crypto
        .createHash("md5")
        .update(bizCfg["requestBody"])
        .digest()
        .toString("base64"),
      Date: new Date().toUTCString(),
      "x-acs-version": bizCfg["greenVersion"],
      "x-acs-signature-nonce": uuidV1(),
      "x-acs-signature-version": "1.0",
      "x-acs-signature-method": "HMAC-SHA1"
    };

    signature(headers, bizCfg);

    const options = {
      hostname: bizCfg["hostname"],
      port: 443,
      path: encodeURI(bizCfg["path"]),
      method: "POST",
      headers
    };

    const request = https.request(options, function(res) {
      res.setEncoding("utf8");

      res.on("data", function(chunk) {
        callback(chunk);
      });
    });

    request.write(bizCfg["requestBody"]);
    request.end();
  }

  function check(content) {
    bizCfg.requestBody = JSON.stringify({
      scenes: ["antispam"],
      tasks: [
        {
          content
        }
      ]
    });

    return new Promise(function(resolve, reject) {
      green(bizCfg, function(result) {
        let greenResult = null;

        try {
          greenResult = JSON.parse(result);
        } catch (error) {
          return reject(error);
        }

        // 使用阿里云返回的文本建议作为判断阈值
        if (greenResult.data[0].results[0].suggestion !== "pass") {
          return resolve(0);
        }

        resolve(1);
      });
    });
  }
}

module.exports = AliTextSensitivity;
