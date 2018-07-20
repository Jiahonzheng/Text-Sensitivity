const TextSensitivity = require("../");

const options = {
  ALI_ACCESS_KEY_ID: "YourAliAccessKeyId",
  ALI_ACCESS_SECRET: "YourAliAccessSecret",
  QCLOUD_ACCESS_KEY_ID: "YourQcloudAccessKeyId",
  QCLOUD_ACCESS_SECRET: "YourQcloudAccessSecret"
};
const check = TextSensitivity(options);

async function test() {
  const contents = ["六四", "法轮功", "援交", "口交", "开心", "学校"];

  for (let i = 0; i < contents.length; i++) {
    console.log(contents[i] + " " + (await check(contents[i])));
  }
}

test();
