const { palindrome } = require('../utils/for_testings')

test.skip('palindrome of atzin', () => {
  const res = palindrome('atzin')

  expect(res).toBe('nizta')
})

test.skip('palindrime of empty string', () => {
  const res = palindrome('')

  expect(res).toBe('')
})

test.skip('palindrome of undefined', () => {
  const result = palindrome()

  expect(result).toBeUndefined()
})
