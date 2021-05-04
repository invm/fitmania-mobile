import { add } from '../../src/utils/utils';

describe('should check add', () => {
  it('should return 4', () => {
    expect(add(2, 2)).toEqual(4);
  });
  it('should return 2o', () => {
    expect(add(2,'o')).toEqual('2o')
  })
});
