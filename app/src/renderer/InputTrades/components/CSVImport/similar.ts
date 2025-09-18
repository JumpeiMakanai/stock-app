export const calculateSimilarity = (a: string, b: string) => {
  // Levenshtein距離を計算
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array(b.length + 1).fill(0)
  )

  for (let i = 0; i <= a.length; i++) dp[i][0] = i
  for (let j = 0; j <= b.length; j++) dp[0][j] = j

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1
      }
    }
  }

  const levenshteinDistance = dp[a.length][b.length]

  const maxLength = Math.max(a.length, b.length)

  // 最長共通部分文字列（LCS）
  const commonSubsequence = calculateLongestCommonSubsequence(a, b)
  const lcsRatio = commonSubsequence.length / maxLength

  // 並び順を無視した共通文字数
  const commonSet = calculateCommonSetSimilarity(a, b)

  // 総合スコアを計算（Levenshtein距離、LCS、文字セット一致度の重み付け）
  const normalizedDistance = 1 - levenshteinDistance / maxLength

  const similarity = normalizedDistance * 0.4 + lcsRatio * 0.4 + commonSet * 0.2

  return similarity * 100
}

// 最長共通部分文字列（LCS）を計算
const calculateLongestCommonSubsequence = (a: string, b: string) => {
  const dp: string[][] = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill('')
  )

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + a[i - 1]
      } else {
        dp[i][j] =
          dp[i - 1][j].length > dp[i][j - 1].length
            ? dp[i - 1][j]
            : dp[i][j - 1]
      }
    }
  }

  return dp[a.length][b.length]
}

// 並び順を無視した文字セット一致度を計算
const calculateCommonSetSimilarity = (a: string, b: string) => {
  const setA = new Set(a)
  const setB = new Set(b)
  const intersection = new Set([...setA].filter((char) => setB.has(char)))

  return intersection.size / Math.max(setA.size, setB.size)
}
