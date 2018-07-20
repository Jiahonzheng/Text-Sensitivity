const Aliyun = require("./lib/aliyun");
const Qcloud = require("./lib/qcloud");

function textSensitivity(options) {
  const {
    ALI_ACCESS_KEY_ID,
    ALI_ACCESS_SECRET,
    QCLOUD_ACCESS_KEY_ID,
    QCLOUD_ACCESS_SECRET
  } = options;
  const aliyun = Aliyun(ALI_ACCESS_KEY_ID, ALI_ACCESS_SECRET);
  const qcloud = Qcloud(QCLOUD_ACCESS_KEY_ID, QCLOUD_ACCESS_SECRET);

  return async function(content) {
    const aliResult = await aliyun(content);
    const qcloudResult = await qcloud(content);

    // 当且仅当阿里云和腾讯云的审核通过，该词汇才会被审核通过
    return aliResult === 1 && qcloudResult === 1;
  };
}

module.exports = textSensitivity;
