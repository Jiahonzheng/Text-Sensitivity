const aliTextSensitivity = require('./aliTextSensitivity');
const qcloudTextSensitivity = require('./qcloudTextSensitivity');

async function checkTextSensitivity(order) {
    let aliResult = await aliTextSensitivity(order);
    let qcloudResult = await qcloudTextSensitivity(order);

    // 当且仅当阿里云和腾讯云的审核通过，该词汇才会被审核通过
    if (aliResult === 1 && qcloudResult === 1) {
        return 1;
    }

    return 0;
}

module.exports = checkTextSensitivity;