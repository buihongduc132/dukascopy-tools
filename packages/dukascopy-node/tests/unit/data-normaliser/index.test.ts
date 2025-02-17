import { getTestCases } from '../../utils';
import { normalise } from '../../../src/data-normaliser';

type Input = Parameters<typeof normalise>[0];
type Output = ReturnType<typeof normalise>;

type TestCase = {
  input: Input;
  expectedOutput: Output;
};

describe('Data normaliser', () => {
  const testCases = getTestCases<TestCase>('tests/unit/data-normaliser/cases');
  testCases.forEach(({ path, content }) => generateTestSuite(content, path));
});

function generateTestSuite({ input, expectedOutput }: TestCase, path: string) {
  const [fileName] = path.split('/').reverse();

  it(`Correctly normalises data for "${fileName}" file`, () => {
    const normalisedData = normalise(input);

    expect(normalisedData).toEqual(expectedOutput);
  });
}
