# jest-recursion

Some sample code to help a fwend figure out how to test a recursive function.

We're using typescript + sinon + jest in our examples.

The AWS SDK was chosen because we have a complimentary opensource project
(stackjanitor) which needs to have a few tests that recursively call the AWS
SDK to fetch the full set of results.

Hopefully this helps more randoms on the webz!

## some notes

pro-tips:
* Always use the `AWSMock.mock` method before actually creating the object/
service you'll stub
* Need to use `expect.toEqual()` when comparing arrays!

### setup notes

I setup this project as a new typescript project (at the time of writing) with
yarn 3 (berry) `yarn set version berry` with node v14.

## examples

We have 1 test suite with 3 tests in there.

### first

[First test](https://github.com/edify42/jest-recursion/blob/master/src/index.test.ts#L21)
is a bit of a primer that ensures that we're correctly stubbing the
CloudFormation service correctly.

### second test

[Second test](https://github.com/edify42/jest-recursion/blob/master/src/index.test.ts#L35)
runs with a `sinon.stub()` that is stubbed twice, with the `onCall` method used
to return (promise resolve) the object we're interested in.

The expected result is an array concatenated as we require it to be.

### third test

[Third test](https://github.com/edify42/jest-recursion/blob/master/src/index.test.ts#L81)
runs like the second test, except with use the `withArgs` method to match a set
of input arguments to a returned (promise resolve) output.

Again we concatenate and match against the functions behaviour!
