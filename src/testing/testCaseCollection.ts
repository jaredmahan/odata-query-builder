import { TestCase } from './testCase';

export class TestCaseCollection {
  constructor(public testCases: TestCase[]) {}
  test = () => this.testCases.forEach(tc => expect(tc.expected).toBe(tc.actual));
}
