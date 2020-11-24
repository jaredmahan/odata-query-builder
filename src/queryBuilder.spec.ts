import { QueryBuilder } from './queryBuilder';
import {TestCase, TestCaseCollection} from './testing';

describe('Query Builder', () => {
  it('should return an empty string when asked to build without options', () => {
    expect(new QueryBuilder().toQuery()).toEqual('');
  });
  it('should return count', () => {
    expect(new QueryBuilder().count().toQuery()).toEqual('?$count=true');
  });
  it('should return order by', () => {
    expect(new QueryBuilder().orderBy('test').toQuery()).toEqual(
      '?$orderby=test'
    );
  });
  it('should only return the last order by', () => {
    expect(new QueryBuilder().orderBy('old').orderBy('test').toQuery()).toEqual(
      '?$orderby=test'
    );
  });
  it('should return top', () => {
    expect(new QueryBuilder().top(1).toQuery()).toEqual('?$top=1');
  });
  it('should only return the last top', () => {
    expect(new QueryBuilder().top(5).top(1).toQuery()).toEqual(
      '?$top=1'
    );
  });
  it('should return skip', () => {
    expect(new QueryBuilder().skip(1).toQuery()).toEqual('?$skip=1');
  });
  it('should only return the last skip', () => {
    expect(new QueryBuilder().skip(5).skip(1).toQuery()).toEqual(
      '?$skip=1'
    );
  });
  it('should return expand', () => {
    expect(new QueryBuilder().expand('test').toQuery()).toEqual(
      '?$expand=test'
    );
  });
  it('should only return the last expand at the root level', () => {
    expect(new QueryBuilder().expand('old').expand('test').toQuery()).toEqual(
      '?$expand=test'
    );
  });
  it('should return select', () => {
    expect(new QueryBuilder().select('test').toQuery()).toEqual(
      '?$select=test'
    );
  });
  it('should only return the last select at the root level', () => {
    expect(new QueryBuilder().select('old').select('test').toQuery()).toEqual(
      '?$select=test'
    );
  });
  it('should add a new filter expression', () => {
    const testCases = new TestCaseCollection([
      new TestCase(
        new QueryBuilder()
          .filter(f => f.filterExpression('testProp1', 'eq', 'testVal1'))
          .toQuery(),
        '?$filter=testProp1 eq \'testVal1\''
      ),
      new TestCase(
        new QueryBuilder()
          .filter(f => f.filterExpression('testProp1', 'eq', 1))
          .toQuery(),
        '?$filter=testProp1 eq 1'
      ),
      new TestCase(
        new QueryBuilder()
          .filter(f => f.filterExpression('testProp1', 'eq', true))
          .toQuery(),
        '?$filter=testProp1 eq true'
      ),
      // TODO: Fix test
      // new TestCase(
      //   new QueryBuilder()
      //     .filter(f =>
      //       f.filterExpression(
      //         'testProp1',
      //         'eq',
      //         new Date(2018, 1, 1, 0, 0, 0, 0)
      //       )
      //     )
      //     .toQuery(),
      //   '?$filter=testProp1 eq 2018-02-01T06:00:00.000Z'
      // )
    ]);

    testCases.test();
  });
  it('should add a new filter phrase', () => {
    expect(
      new QueryBuilder()
        .filter(f => f.filterPhrase('contains(\'test\')'))
        .toQuery()
    ).toEqual('?$filter=contains(\'test\')');
  });

  it('should add multiple filters (should default to and)', () => {
    const testCases = new TestCaseCollection([
      new TestCase(
        new QueryBuilder()
          .filter(f =>
            f
              .filterExpression('testProp1', 'eq', 'testVal1')
              .filterExpression('testProp2', 'eq', 'testVal2')
          )
          .toQuery(),
        '?$filter=testProp1 eq \'testVal1\' and testProp2 eq \'testVal2\''
      ),
      new TestCase(
        new QueryBuilder()
          .filter(f =>
            f
              .filterPhrase('contains(\'test1\')')
              .filterPhrase('contains(\'test2\')')
          )
          .toQuery(),
        '?$filter=contains(\'test1\') and contains(\'test2\')'
      ),
      new TestCase(
        new QueryBuilder()
          .filter(f =>
            f
              .filterExpression('testProp1', 'eq', 'testVal1')
              .filterPhrase('contains(\'test\')')
          )
          .toQuery(),
        '?$filter=testProp1 eq \'testVal1\' and contains(\'test\')'
      )
    ]);
    testCases.test();
  });

  it('should add multiple \'and\' filters', () => {
    const testCases = new TestCaseCollection([
      new TestCase(
        new QueryBuilder()
          .filter(
            f =>
              f
                .filterExpression('testProp1', 'eq', 'testVal1')
                .filterExpression('testProp2', 'eq', 'testVal2'),
            {operator:'and'}
          )
          .toQuery(),
        '?$filter=testProp1 eq \'testVal1\' and testProp2 eq \'testVal2\''
      ),
      new TestCase(
        new QueryBuilder()
          .filter(
            f =>
              f
                .filterPhrase('contains(\'test1\')')
                .filterPhrase('contains(\'test2\')'),
            {operator:'and'}
          )
          .toQuery(),
        '?$filter=contains(\'test1\') and contains(\'test2\')'
      ),
      new TestCase(
        new QueryBuilder()
          .filter(
            f =>
              f
                .filterExpression('testProp1', 'eq', 'testVal1')
                .filterPhrase('contains(\'test\')'),
            {operator:'and'}
          )
          .toQuery(),
        '?$filter=testProp1 eq \'testVal1\' and contains(\'test\')'
      )
    ]);
    testCases.test();
  });

  it('should add multiple \'or\' filters', () => {
    const testCases = new TestCaseCollection([
      new TestCase(
        new QueryBuilder()
          .filter(
            f =>
              f
                .filterExpression('testProp1', 'eq', 'testVal1')
                .filterExpression('testProp2', 'eq', 'testVal2'),
            {operator:'or'}
          )
          .toQuery(),
        '?$filter=testProp1 eq \'testVal1\' or testProp2 eq \'testVal2\''
      ),
      new TestCase(
        new QueryBuilder()
          .filter(
            f =>
              f
                .filterPhrase('contains(\'test1\')')
                .filterPhrase('contains(\'test2\')'),
            {operator:'or'}
          )
          .toQuery(),
        '?$filter=contains(\'test1\') or contains(\'test2\')'
      ),
      new TestCase(
        new QueryBuilder()
          .filter(
            f =>
              f
                .filterExpression('testProp1', 'eq', 'testVal1')
                .filterPhrase('contains(\'test\')'),
            {operator:'or'}
          )
          .toQuery(),
        '?$filter=testProp1 eq \'testVal1\' or contains(\'test\')'
      )
    ]);
    testCases.test();
  });
  it('should add nested \'or\' filters', () => {
    const testCases = new TestCaseCollection([
      new TestCase(
        new QueryBuilder()
          .filter(f1 =>
            f1
              .filterExpression('testProp1', 'eq', 'testVal1')
              .or(f2 =>
                f2
                  .filterExpression('testProp2', 'eq', 'testVal2')
                  .filterExpression('testProp3', 'eq', 'testVal3')
              )
          )
          .toQuery(),
        '?$filter=testProp1 eq \'testVal1\' and (testProp2 eq \'testVal2\' or testProp3 eq \'testVal3\')'
      ),
      new TestCase(
        new QueryBuilder()
          .filter(
            f1 =>
              f1
                .filterExpression('testProp1', 'eq', 'testVal1')
                .or(f2 =>
                  f2
                    .filterExpression('testProp2', 'eq', 'testVal2')
                    .filterExpression('testProp3', 'eq', 'testVal3')
                ),
            {operator:'and'}
          )
          .toQuery(),
        '?$filter=testProp1 eq \'testVal1\' and (testProp2 eq \'testVal2\' or testProp3 eq \'testVal3\')'
      ),
      new TestCase(
        new QueryBuilder()
          .filter(
            f1 =>
              f1
                .filterExpression('testProp1', 'eq', 'testVal1')
                .or(f2 =>
                  f2
                    .filterExpression('testProp2', 'eq', 'testVal2')
                    .filterExpression('testProp3', 'eq', 'testVal3')
                ),
            {operator:'or'}
          )
          .toQuery(),
        '?$filter=testProp1 eq \'testVal1\' or (testProp2 eq \'testVal2\' or testProp3 eq \'testVal3\')'
      )
    ]);
    testCases.test();
  });
  it('should add nested \'and\' filters', () => {
    const testCases = new TestCaseCollection([
      new TestCase(
        new QueryBuilder()
          .filter(f1 =>
            f1
              .filterExpression('testProp1', 'eq', 'testVal1')
              .and(f2 =>
                f2
                  .filterExpression('testProp2', 'eq', 'testVal2')
                  .filterExpression('testProp3', 'eq', 'testVal3')
              )
          )
          .toQuery(),
        '?$filter=testProp1 eq \'testVal1\' and (testProp2 eq \'testVal2\' and testProp3 eq \'testVal3\')'
      ),
      new TestCase(
        new QueryBuilder()
          .filter(
            f1 =>
              f1
                .filterExpression('testProp1', 'eq', 'testVal1')
                .and(f2 =>
                  f2
                    .filterExpression('testProp2', 'eq', 'testVal2')
                    .filterExpression('testProp3', 'eq', 'testVal3')
                ),
            {operator:'and'}
          )
          .toQuery(),
        '?$filter=testProp1 eq \'testVal1\' and (testProp2 eq \'testVal2\' and testProp3 eq \'testVal3\')'
      ),
      new TestCase(
        new QueryBuilder()
          .filter(
            f1 =>
              f1
                .filterExpression('testProp1', 'eq', 'testVal1')
                .and(f2 =>
                  f2
                    .filterExpression('testProp2', 'eq', 'testVal2')
                    .filterExpression('testProp3', 'eq', 'testVal3')
                ),
            {operator:'or'}
          )
          .toQuery(),
        '?$filter=testProp1 eq \'testVal1\' or (testProp2 eq \'testVal2\' and testProp3 eq \'testVal3\')'
      )
    ]);
    testCases.test();
  });
  it('should add a filter and then add another, clearing the first one', () => {
    const query =  new QueryBuilder().filter(f1 => f1
      .filterExpression('testProp1','eq','testVal1')
    )
    expect(query.toQuery()).toBe('?$filter=testProp1 eq \'testVal1\'')

    query.filter(f2 => f2
      .filterExpression('testProp2','eq','testVal2'),
      { clearPreviousFilters: true }
    )
    expect(query.toQuery()).toBe('?$filter=testProp2 eq \'testVal2\'')
  })
  it('should add a filter and then add another, not clearing the first one', () => {
    const query =  new QueryBuilder().filter(f1 => f1
      .filterExpression('testProp1','eq','testVal1')
    )
    expect(query.toQuery()).toBe('?$filter=testProp1 eq \'testVal1\'')

    query.filter(f2 => f2
      .filterExpression('testProp2','eq','testVal2'),
      { clearPreviousFilters: false }
    )
    expect(query.toQuery()).toBe('?$filter=testProp1 eq \'testVal1\' and testProp2 eq \'testVal2\'')
  })
});
