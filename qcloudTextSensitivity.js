// 腾讯云文智敏感词检测API详细文档：
// https://cloud.tencent.com/document/api/271/2615

const Capi = require("qcloudapi-sdk");
const {QCLOUD_ACCESS_KEY_ID, QCLOUD_ACCESS_SECRET} = require('./config.json');

let capi = new Capi({
	SecretId: QCLOUD_ACCESS_KEY_ID,
	SecretKey: QCLOUD_ACCESS_SECRET,
	serviceType: "wenzhi"
});

async function qcloudTextSensitivity(order) {
	let promises = [];

	// type
	// 1: 色情
	// 2: 政治
	for (let i = 1; i <= 2; i++) {
		promises.push(new Promise((resolve ,reject) => {
			capi.request({
				Region: "gz" ,
				Action: "TextSensitivity" ,
				content: order ,
				type: i
			} ,function (err ,data) {
				if (err) {
					console.log(err);
					reject();
				}
				resolve(data);
			});
		}));
	}
	
	// 对 Promise 数组使用 Promise.all 方法
	return new Promise((resolve, reject) => {
		Promise.all(promises)
			.then(data => {
				if (data[0].sensitive > 0.5 || data[1].sensitive > 0.5) {
					resolve(0);
				}
				resolve(1);
			})
			.catch(() => reject());
	});
}

module.exports = qcloudTextSensitivity;
