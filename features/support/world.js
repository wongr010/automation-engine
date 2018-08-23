exports.env=(require("../../../../../devops/tools/aws/setup"))(); //this line suited for build_e2e

const {setWorldConstructor} = require('cucumber');
const {testControllerHolder} = require('./testControllerHolder');


function CustomWorld({attach, parameters}) {
    if (!process.env.e2e_maple_url){
        throw Error("e2e_maple_url env variable not configured");
    }
    if (!process.env.project_id){
        throw Error("project_id env variable not configured");
    }
    if (!process.env.e2e_maple_pass){
        throw Error("e2e_maple_pass env variable not configured");
    }
    if (!process.env.e2e_maple_user){
        throw Error("e2e_maple_user env variable not configured");
    }
    if (!process.env.e2e_browser){
        throw Error("e2e_browser env variable not configured");
    }

    this.waitForTestController = testControllerHolder.get()
        .then(function(tc) {

            return testController = tc;
        });

    this.attach = attach;

    this.setBrowser = function() {

        if (parameters.browser === undefined) {
            return 'chrome';
        } else {
            return parameters.browser;
        }
    };

    // this.addScreenshotToReport = function() {
    //
    //     if (process.argv.includes('--format') || process.argv.includes('-f') || process.argv.includes('--format-options')) {
    //         testController.takeScreenshot()
    //             .then(function(pathToScreenshot) {
    //                 var imgInBase64 = base64Img.base64Sync(pathToScreenshot);
    //                 var imageConvertForCuc = imgInBase64.substring(imgInBase64.indexOf(',') + 1);
    //                 return attach(imageConvertForCuc, 'image/png');
    //             });
    //     } else {
    //         return new Promise((resolve) => {
    //             resolve(null);
    //         });
    //     }
    // };
    //
    // this.attachScreenshotToReport = function(pathToScreenshot) {
    //     var imgInBase64 = base64Img.base64Sync(pathToScreenshot);
    //     var imageConvertForCuc = imgInBase64.substring(imgInBase64.indexOf(',') + 1);
    //     return attach(imageConvertForCuc, 'image/png');
    // };
}

setWorldConstructor(CustomWorld);
