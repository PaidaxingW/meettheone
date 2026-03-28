// Multi-dimensional matching engine
interface UserScores {
  bigfive?: Record<string, number>
  lovelanguage?: Record<string, number>
  travel?: Record<string, number>
  marriage?: Record<string, number>
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0
  let dot = 0, magA = 0, magB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    magA += a[i] * a[i]
    magB += b[i] * b[i]
  }
  return magA && magB ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0
}

function complementScore(a: number[], b: number[]): number {
  // Reward complementary traits (one high, other low)
  if (a.length !== b.length) return 0
  let score = 0
  for (let i = 0; i < a.length; i++) {
    const diff = Math.abs(a[i] - b[i])
    score += 1 - diff / 5 // normalize to 0-1
  }
  return score / a.length
}

export function calculateMatch(
  myScores: UserScores,
  theirScores: UserScores,
  weights: Record<string, number> = { bigfive: 0.3, lovelanguage: 0.25, travel: 0.2, marriage: 0.25 }
): { total: number; dimensions: Record<string, number> } {
  const dimensions: Record<string, number> = {}
  let total = 0

  for (const [quiz, weight] of Object.entries(weights)) {
    const myQ = myScores[quiz as keyof UserScores]
    const theirQ = theirScores[quiz as keyof UserScores]
    if (!myQ || !theirQ) continue

    const myVals = Object.values(myQ)
    const theirVals = Object.values(theirQ)
    
    const similarity = cosineSimilarity(myVals, theirVals)
    const complement = complementScore(myVals, theirVals)
    const dimScore = (similarity * 0.6 + complement * 0.4) * 100
    dimensions[quiz] = Math.round(dimScore)
    total += dimScore * weight
  }

  return { total: Math.round(total), dimensions }
}

export function getDailyRecommendations(
  userId: string,
  allUsers: Array<{ id: string; scores: UserScores }>,
  myScores: UserScores,
  limit: number = 3
): Array<{ userId: string; score: number; dimensions: Record<string, number> }> {
  const results = allUsers
    .filter(u => u.id !== userId && u.scores)
    .map(u => ({ userId: u.id, score: calculateMatch(myScores, u.scores).total, dimensions: calculateMatch(myScores, u.scores).dimensions }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return results
}
