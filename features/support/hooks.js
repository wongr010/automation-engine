const fs = require('fs');
const createTestCafe = require('testcafe');
const {testControllerHolder} = require('./testControllerHolder');
const {AfterAll, setDefaultTimeout, Before, After, Status} = require('cucumber');
const {addErrorToController} = require('./testControllerHolder');
//const stream = fs.createWriteStream('../report.xml');


var isTestCafeError = false;
var attachScreenshotToReport = null;
var cafeRunner = null;
var TIMEOUT = 50000;
var iter=0;
var stream;

function createTestFile(name) {
    fs.writeFileSync('test.js',

        'import {testControllerHolder} from "./features/support/testControllerHolder.js";\n\n' +

        'fixture("fixture")\n' +

        'test\n' +
        `('${name}', testControllerHolder.capture)\n` +
		'.httpAuth({\n'+
		`username: "${process.env.e2e_maple_user}",\n`+
		`password: "${process.env.e2e_maple_pass}",\n`+
		'})');

        //+'.after(async t => {await errorHandling.ifErrorTakeScreenshot(t)})');
}

function runTest() {
    let runner = null;


    createTestCafe('localhost')
        .then(function(tc) {
            cafeRunner = tc;
            runner = tc.createRunner();
            return runner
                .src('./test.js')
                //.screenshots('reports/screenshots/', true)
                .browsers(`${process.env.e2e_browser}`)
                .reporter('xunit', stream)
                .run({
                    selectorTimeout: 50000,
                    assertionTimeout: 10000,
                })
                .catch(function(error) {
                    console.log(error);
                });
        })
        .then(function(report) {
            console.log(report+" test failed");

        });
}


setDefaultTimeout(TIMEOUT);

Before(async function(scenario) {
    stream=fs.createWriteStream('../../report'+iter+'.xml');
    iter++;
    runTest();
    createTestFile(scenario.pickle.name);
    return this.waitForTestController.then(function(testController) {
        return testController.maximizeWindow();
    });
});

After(function() {

    fs.unlinkSync('test.js');
    testControllerHolder.free();
});

After(function(testCase) {
    let world = this;
    if (testCase.result.status === Status.FAILED) {
        isTestCafeError = true;
        //attachScreenshotToReport = world.attachScreenshotToReport;
        addErrorToController();
    }
});



AfterAll(function(){

    function cleanup(){

        cafeRunner.close();
        if (isTestCafeError) throw new Error("Test failed!");
        process.exit(0);
    }
     timeoutID = setTimeout(cleanup, 1000); //this works, although hard coded

});
