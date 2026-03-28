export interface UserProfile {
  id: string
  email: string
  name: string | null
  image: string | null
  gender: string | null
  birthDate: string | null
  height: number | null
  occupation: string | null
  education: string | null
  income: string | null
  location: string | null
  bio: string | null
  membership: string
}

export interface QuizScores {
  quizType: string
  scores: Record<string, number>
}

export interface MatchScore {
  userId: string
  score: number
  dimensions: Record<string, number>
}

export interface Message {
  id: string
  content: string
  senderId: string
  createdAt: string
  read: boolean
}
