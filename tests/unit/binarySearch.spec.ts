import {binarySearch} from '@/store/scale'

const TEST_ARR = [
  { value: -50 },
  { value: -40 },
  { value: -30 },
  { value: -20 },
  { value: -10 },
  { value: 0 },
  { value: 10 },
  { value: 20 },
  { value: 30 },
  { value: 40 },
  { value: 50 }
]

const TEST_TARGET_NEG = -17
const TEST_TARGET_ZERO = 0
const TEST_TARGET_POS = 22

describe('Binary search, normal values:', () => {
  test('negative target', () => {
    expect(binarySearch(TEST_ARR, TEST_TARGET_NEG, 0, TEST_ARR.length - 1).value)
      .toBeCloseTo(TEST_TARGET_NEG - 3)
  })
  test('zero target', () => {
    expect(binarySearch(TEST_ARR, TEST_TARGET_ZERO, 0, TEST_ARR.length - 1).value)
      .toBeCloseTo(TEST_TARGET_ZERO)
  })
  test('positive target', () => {
    expect(binarySearch(TEST_ARR, TEST_TARGET_POS, 0, TEST_ARR.length - 1).value)
      .toBeCloseTo(TEST_TARGET_POS - 2)
  })
})

describe('Binary search, small values:', () => {
  const smallArr = TEST_ARR.map(it => ({value: it.value / 1000000}))
  test('negative target', () => {
    expect(binarySearch(smallArr, TEST_TARGET_NEG / 1000000, 0, smallArr.length - 1).value)
      .toBeCloseTo((TEST_TARGET_NEG - 3) / 1000000)
  })
  test('zero target', () => {
    expect(binarySearch(smallArr, TEST_TARGET_ZERO / 1000000, 0, smallArr.length - 1).value)
      .toBeCloseTo(TEST_TARGET_ZERO / 1000000)
  })
  test('positive target', () => {
    expect(binarySearch(smallArr, TEST_TARGET_POS / 1000000, 0, smallArr.length - 1).value)
      .toBeCloseTo((TEST_TARGET_POS - 2) / 1000000)
  })
})

describe('Binary search, large values:', () => {
  const largeArr = TEST_ARR.map(it => ({value: it.value * 1000000}))
  test('negative target', () => {
    expect(binarySearch(largeArr, TEST_TARGET_NEG * 1000000, 0, largeArr.length - 1).value)
      .toBeCloseTo((TEST_TARGET_NEG - 3) * 1000000)
  })
  test('zero target', () => {
    expect(binarySearch(largeArr, TEST_TARGET_ZERO * 1000000, 0, largeArr.length - 1).value)
      .toBeCloseTo(TEST_TARGET_ZERO * 1000000)
  })
  test('positive target', () => {
    expect(binarySearch(largeArr, TEST_TARGET_POS * 1000000, 0, largeArr.length - 1).value)
      .toBeCloseTo((TEST_TARGET_POS - 2) * 1000000)
  })
})