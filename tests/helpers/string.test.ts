import { isEmail } from '~/helpers/string'

describe('string helpers', () => {
  describe('isEmail', () => {
    it('should accept correct email', () => {
      expect(isEmail('abc@def.ghi')).toBe(true)
      expect(isEmail('john.doe@domain.com')).toBe(true)
      expect(isEmail('dog1@cats-only.ru')).toBe(true)
      expect(isEmail('some_example@some_example.some_example')).toBe(true)
      expect(isEmail('some-example@some-example.some-example')).toBe(true)
    })

    it('should reject correct email', () => {
      expect(isEmail('def.ghi')).toBe(false)
      expect(isEmail('john.doe.domain.com')).toBe(false)
      expect(isEmail('dog1&@cats-only.ru')).toBe(false)
      expect(isEmail('some_e]xample@some_example.some_example')).toBe(false)
      expect(isEmail('some-example@some-example.(some-example)')).toBe(false)
      expect(isEmail('some-example@abc')).toBe(false)
      expect(isEmail('some-example@')).toBe(false)
    })
  })
})
