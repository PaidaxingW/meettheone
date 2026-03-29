export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import {
  getSession,
  createSession,
  addMessage,
  markCompleted,
  parseScores,
  SYSTEM_PROMPT,
} from "@/lib/assessment-prompt"

const OPENAI_API_URL = process.env.OPENAI_API_URL || "https://api.openai.com/v1/chat/completions"
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini"

function generateSessionId(): string {
  return "asmt_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8)
}

// POST /api/assessment — start or continue assessment
export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "AI 服务未配置，请联系管理员" },
      { status: 503 }
    )
  }

  try {
    const body = await req.json()
    const { sessionId, message } = body

    // Start new session
    if (!sessionId) {
      const newSessionId = generateSessionId()
      createSession(newSessionId)

      // Send first AI message
      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content:
                "请开始我们的性格评估对话吧。记得要自然、温暖，像朋友聊天一样。先简单打个招呼，然后开始第一个话题。",
            },
          ],
          max_tokens: 300,
          temperature: 0.8,
        }),
      })

      if (!response.ok) {
        const errText = await response.text()
        console.error("OpenAI API error:", response.status, errText)
        return NextResponse.json(
          { error: "AI 服务暂时不可用，请稍后再试" },
          { status: 502 }
        )
      }

      const data = await response.json()
      const aiMessage = data.choices[0]?.message?.content || "嗨！很高兴认识你 😊"

      addMessage(newSessionId, "assistant", aiMessage)

      // Check if assessment is complete (unlikely on first message, but handle it)
      const scores = parseScores(aiMessage)
      if (scores) {
        markCompleted(newSessionId, scores)
        const cleanMessage = aiMessage.replace(/\[ASSESSMENT_COMPLETE\][\s\S]*/, "").trim()
        return NextResponse.json({
          sessionId: newSessionId,
          message: cleanMessage,
          completed: true,
          scores,
        })
      }

      return NextResponse.json({
        sessionId: newSessionId,
        message: aiMessage,
        completed: false,
      })
    }

    // Continue existing session
    const session = getSession(sessionId)
    if (!session) {
      return NextResponse.json({ error: "会话已过期，请重新开始" }, { status: 404 })
    }
    if (session.completed) {
      return NextResponse.json({
        sessionId,
        message: "",
        completed: true,
        scores: session.scores,
      })
    }

    // Add user message
    addMessage(sessionId, "user", message)

    // Build conversation history
    const messages: Array<{ role: string; content: string }> = [
      { role: "system", content: SYSTEM_PROMPT },
      ...session.messages,
    ]

    // Call AI
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages,
        max_tokens: 500,
        temperature: 0.8,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error("OpenAI API error:", response.status, errText)
      return NextResponse.json(
        { error: "AI 服务暂时不可用，请稍后再试" },
        { status: 502 }
      )
    }

    const data = await response.json()
    const aiMessage = data.choices[0]?.message?.content || "嗯，让我再想想..."

    addMessage(sessionId, "assistant", aiMessage)

    // Check if assessment is complete
    const scores = parseScores(aiMessage)
    if (scores) {
      markCompleted(sessionId, scores)
      const cleanMessage = aiMessage
        .replace(/\[ASSESSMENT_COMPLETE\][\s\S]*/, "")
        .trim()
      return NextResponse.json({
        sessionId,
        message: cleanMessage,
        completed: true,
        scores,
      })
    }

    return NextResponse.json({
      sessionId,
      message: aiMessage,
      completed: false,
    })
  } catch (error) {
    console.error("Assessment API error:", error)
    return NextResponse.json(
      { error: "服务异常，请稍后再试" },
      { status: 500 }
    )
  }
}

// GET /api/assessment?sessionId=xxx — get session status
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get("sessionId")
  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 })
  }

  const session = getSession(sessionId)
  if (!session) {
    return NextResponse.json({ error: "会话不存在或已过期" }, { status: 404 })
  }

  return NextResponse.json({
    sessionId,
    completed: session.completed,
    scores: session.scores,
  })
}
