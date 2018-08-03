import { TestCase } from './testCase';

export class TestCaseCollection {
  constructor(private testCases: TestCase[]) {}
  test = () => {
    return this.testCases.forEach(tc => expect(tc.expected).toBe(tc.actual));
  };
}
