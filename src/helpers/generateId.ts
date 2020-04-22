/* eslint-disable no-bitwise */
export const generateId = (): string =>
  'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () =>
    (
      (Math.floor(new Date().getTime() / 16) + Math.random() * 16) % 16 |
      (0 & 0x3) |
      0x8
    ).toString(16)
  )
