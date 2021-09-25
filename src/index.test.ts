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
  AWSMock.restore('CloudFormation')
});

describe('my test', ()=> {
  // first way, not that great!
  it('shoul test something', async () => {
    const result: StackSummaries = []
    // dependency injection
    const cfnMock = sinon.stub();
    const mockResolves: ListStacksOutput = {}
    AWSMock.mock('CloudFormation', 'listStacks', cfnMock)
    const cfn = new AWS.CloudFormation();
    cfnMock.resolves(mockResolves)
    const mystacks = await listStacks(cfn);
    console.log(cfnMock.called)
    expect(mystacks).toEqual(result)
  })

  // second way with sinon using onCall
  it('should run the mocks with sinon!', async () => {
    const cfnMock = sinon.stub();
    AWSMock.mock('CloudFormation', 'listStacks', cfnMock);

    cfnMock.resolves([]);

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
    // console.log(result)
    expect(result).toEqual(expected)
  })

  // third way with matching of request params
  it('should run the mocks with sinon with matching params', async () => {
    const cfnMock = sinon.stub();

    const now = new Date();
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

    const firstArgs: AWS.CloudFormation.Types.ListStacksInput = {
      NextToken: second.NextToken,
    }

    const secondArgs: AWS.CloudFormation.Types.ListStacksInput = {
      NextToken: first.NextToken,
    }

    cfnMock.withArgs(secondArgs).resolves(second)

    cfnMock.withArgs(firstArgs).resolves(first)

    
    AWSMock.mock('CloudFormation', 'listStacks', cfnMock);
    const cfn = new AWS.CloudFormation();

    let expected:AWS.CloudFormation.Types.StackSummaries = []

    expected = expected.concat(first.StackSummaries)
    expected = expected.concat(second.StackSummaries)

    const result = await listStacks(cfn);

    console.log(cfnMock.called)
    expect(result).toEqual(expected)
  })
})