import { listStacks } from './index'
import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';
import * as sinon from 'sinon';
import { ListStacksOutput, StackSummaries } from 'aws-sdk/clients/cloudformation';


interface myOutput extends ListStacksOutput {
  StackSummaries: StackSummaries,
}

AWSMock.setSDKInstance(AWS)

afterEach(() => {
  sinon.restore();
});

describe('my test', ()=> {
  // first way, not that great!
  // it('shoul test something', async () => {
  //   const result:StackSummaries = []
  //   // dependency injection

  //   AWSMock.mock('CloudFormation', 'listStacks', (params: AWS.CloudFormation.Types.ListStacksInput, callback: Function) => {
  //     console.log('DynamoDB', 'getItem', 'mock called', params);
  //     callback(null, result);
  //   })
  //   const mystacks = await listStacks();
  //   console.log(mystacks)
  //   expect(mystacks).toEqual(result)
  //   AWSMock.restore();
  // })

  // second way with sinon
  it('should run the mocks with sinon!', async () => {
    const cfnMock = sinon.stub();
    AWSMock.mock('CloudFormation', 'listStacks', cfnMock);

    const now = new Date();
    
    const cfn = new AWS.CloudFormation();


    const first: myOutput = {
      NextToken: "yeah",
      StackSummaries: [
        {
          StackName: "teddy_first",
          StackStatus: "CREATE_COMPLETE",
          CreationTime: now,
        }
      ]
    }

    const second: myOutput = {
      StackSummaries: [
        {
          StackName: "teddy_second",
          StackStatus: "CREATE_COMPLETE",
          CreationTime: now,
        }
      ]
    }

    let expected:AWS.CloudFormation.Types.StackSummaries = []

    expected = expected.concat(first.StackSummaries)
    expected = expected.concat(second.StackSummaries)
    cfnMock.onCall(0).resolves(first)
    cfnMock.onCall(1).resolves(second)

    const result = await listStacks(cfn);

    console.log(cfnMock.called)
    console.log(result)
    expect(result).toEqual(expected)
  })
})