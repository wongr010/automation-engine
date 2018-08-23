//PURPOSE: exporting the error handling functions as well as the testcontroller

const testcafe = require('testcafe');
const hooks = require('./hooks');

var testControllerHolder = {
    testController: null,

    captureResolver: null,
    getResolver: null,

    capture: function(t) {

        testControllerHolder.testController = t;

        if (testControllerHolder.getResolver) {
            testControllerHolder.getResolver(t);
        }

        return new Promise(function(resolve) {
            testControllerHolder.captureResolver = resolve;
        });
    },

    free: function() {

        testControllerHolder.testController = null;

        if (testControllerHolder.captureResolver) {
            testControllerHolder.captureResolver();
        }
    },

    get: function() {
        return new Promise(function(resolve) {
            if (testControllerHolder.testController) {
                resolve(testControllerHolder.testController);
            } else {
               testControllerHolder.getResolver = resolve;
            }
        });
    },
};


 function addErrorToController() {
    testController.executionChain
        .catch(function(result) {
            errAdapter = new testcafe.embeddingUtils.TestRunErrorFormattableAdapter(result, {
                screenshotPath: null,
                testRunPhase: testController.testRun.phase,
                userAgent: testController.testRun.browserConnection.browserInfo.userAgent,
            });
            return testController.testRun.errs.push(errAdapter);
        });
};



module.exports={testControllerHolder, addErrorToController};
