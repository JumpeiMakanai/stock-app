/// 参考url
/// https://qiita.com/al_tarte/items/eaaf404554f553fa3909

import fnv from 'fnv-plus'

class HashStr {
  private static str62 =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  private static toBase62(n: bigint) {
    let hashStr = ''
    const baseNum = 62n

    while (n >= baseNum) {
      hashStr += this.str62[Number(n % baseNum)]
      n /= baseNum
    }

    return (hashStr += this.str62[Number(n)])
  }

  static hash64bit(
    value = `${Date.now()}${Math.floor(Math.random() * 1e7)}`
  ): string {
    const hashNum = BigInt(`0x${fnv.fast1a64(value)}`)
    return this.toBase62(hashNum)
  }

  static randCode(length = 11) {
    return Array.from(
      { length },
      () => this.str62[Math.floor(Math.random() * this.str62.length)]
    ).join('')
  }
}

export default HashStr
