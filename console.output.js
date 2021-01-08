module.exports = {
    webpackBarName: "vue3 & antdv2",
    webpackBanner:
        " build: vue3 & antdv2 \n vue3 & antdv2 author: peiwj pwjiang@163.com \n vue3 & antdv2 \n time: ",
    donationConsole() {
        const chalk = require("chalk");
        console.log(
            chalk.green(
                `> 欢迎使用vue3 & antdv2，开源地址：https://github.com/chuzhixin/vue-admin-beautiful`
            )
        );

        console.log(
            chalk.green(
                `> pro版演示地址：http://chu1204505056.gitee.io/vue-admin-beautiful-pro?hmsr=console&hmpl=&hmcu=&hmkw=&hmci=`
            )
        );

        console.log(
            chalk.green(
                `> vue 2.x版本演示地址（MIT协议免费商用）：http://chu1204505056.gitee.io/vue-admin-beautiful?hmsr=console&hmpl=&hmcu=&hmkw=&hmci=`
            )
        );

        console.log(
            chalk.green(
                `> vue3.X版演示地址（element-plus 后期主线版本MIT协议免费商用）：即将发布请关注github vue-admin-beautiful动态`
            )
        );

        console.log(
            chalk.green(
                `> vue3.X版演示地址（andv MIT协议免费商用）：http://chu1204505056.gitee.io/vue-admin-beautiful-antdv?hmsr=console&hmpl=&hmcu=&hmkw=&hmci=`
            )
        );

        console.log(
            chalk.green(
                `> 使用中出现任何问题可加QQ群反馈，获取文档（群号：972435319，1139183756）`
            )
        );

        console.log(
            chalk.green(`> 如果您不希望显示以上信息，可在.src/config/config.js中 donation 配置 false 关闭`)
        );
        // console.log("\n");
    },
};
