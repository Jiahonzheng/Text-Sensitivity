// 阿里云文本反垃圾API详细文档：
// https://help.aliyun.com/document_detail/53423.html?spm=a2c4g.11174283.3.8.Zdu4ZU

const {ALI_ACCESS_KEY_ID, ALI_ACCESS_SECRET} = require("./config.json");
const crypto = require("crypto");
const https = require("https");
const uuidV1 = require("uuid/v1");

const bizCfg = {
	"accessKeyId": ALI_ACCESS_KEY_ID,
	"accessKeySecret": ALI_ACCESS_SECRET,
	"path": "/green/text/scan",
	"requestBody": null,
	"hostname": "green.cn-shanghai.aliyuncs.com",
	"greenVersion": "2017-01-12"
};

function signature(requestHeaders, bizCfg) {
	let accessKeyId = bizCfg["accessKeyId"];
	let accessKeySecret = bizCfg["accessKeySecret"];
	let path = bizCfg["path"];

	let signature = [];
	signature.push("POST\n");
	signature.push("application/json\n");
	signature.push(requestHeaders["Content-MD5"] + "\n");
	signature.push("application/json\n");
	signature.push(requestHeaders["Date"] + "\n");
	signature.push("x-acs-signature-method:HMAC-SHA1\n");
	signature.push("x-acs-signature-nonce:" + requestHeaders["x-acs-signature-nonce"] + "\n");
	signature.push("x-acs-signature-version:1.0\n");
	signature.push("x-acs-version:2017-01-12\n");
	signature.push(path);


	let authorization = crypto.createHmac("sha1", accessKeySecret)
		.update(signature.join(""))
		.digest().toString("base64");

	requestHeaders.Authorization = "acs " + accessKeyId + ":" + authorization;
}

function green(bizCfg, callback) {
	let path = bizCfg["path"];
	let requestBody = bizCfg["requestBody"];
	let greenVersion = bizCfg["greenVersion"];
	let hostname = bizCfg["hostname"];
	let gmtCreate = new Date().toUTCString();
	let md5 = crypto.createHash("md5");

	let requestHeaders = {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"Content-MD5": md5.update(requestBody).digest().toString("base64"),
		"Date": gmtCreate,
		"x-acs-version": greenVersion,
		"x-acs-signature-nonce": uuidV1(),
		"x-acs-signature-version": "1.0",
		"x-acs-signature-method": "HMAC-SHA1"
	};

	signature(requestHeaders, bizCfg);

	let options = {
		hostname: hostname,
		port: 443,
		path: encodeURI(path),
		method: "POST",
		headers: requestHeaders
	};

	let req = https.request(options, function (res) {
		res.setEncoding("utf8");
		res.on("data", function (chunk) {
			callback(chunk);
		});
	});

	req.write(requestBody);
	req.end();
}

async function checkTextSensitivity(order) {
	bizCfg.requestBody = JSON.stringify({
		scenes: ["antispam"],
		tasks: [{
			"content": order
		}]
	});

	return new Promise((resolve, reject) => {
		green(bizCfg, function (result) {
			let greenResult = JSON.parse(result);

			// 使用阿里云返回的文本建议作为判断阈值
			if (greenResult.data[0].results[0].suggestion !== "pass") {
				resolve(0);
			}

			resolve(1);
		});
	});
}

module.exports = checkTextSensitivity;