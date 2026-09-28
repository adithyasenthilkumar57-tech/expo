import { NextRequest, NextResponse } from "next/server";
import { mockKnowledgeBase } from "@/lib/mock-data";

// POST /api/v1/agent — main AI agent endpoint
// This is what the widget calls to get AI responses
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationId, businessId, context } = body;

    if (!message || !businessId) {
      return NextResponse.json({ error: "message and businessId are required" }, { status: 400 });
    }

    // ─── Step 1: Retrieve relevant KB entries (RAG) ─────────────────────────
    const relevantKB = mockKnowledgeBase
      .filter((kb) => kb.businessId === businessId && kb.isActive)
      .filter((kb) => {
        const lowerMsg = message.toLowerCase();
        const lowerQ = kb.question.toLowerCase();
        const lowerA = kb.answer.toLowerCase();
        // Simple keyword matching — in prod: use pgvector cosine similarity
        return lowerMsg.split(" ").some((word) =>
          word.length > 3 && (lowerQ.includes(word) || lowerA.includes(word))
        );
      })
      .slice(0, 3);

    const kbContext = relevantKB.length > 0
      ? `\n\nRelevant business knowledge:\n${relevantKB.map(kb => `Q: ${kb.question}\nA: ${kb.answer}`).join("\n\n")}`
      : "";

    // ─── Step 2: Classify intent ─────────────────────────────────────────────
    const lowerMsg = message.toLowerCase();
    let intent = "general_question";
    let leadSignals: { budget?: number; need?: string; timeline?: string } = {};

    if (lowerMsg.includes("price") || lowerMsg.includes("cost") || lowerMsg.includes("budget") || lowerMsg.includes("$")) {
      intent = "pricing_inquiry";
    }
    if (lowerMsg.includes("service") || lowerMsg.includes("help") || lowerMsg.includes("need") || lowerMsg.includes("looking for")) {
      intent = "lead_inquiry";
    }
    if (lowerMsg.includes("schedule") || lowerMsg.includes("appointment") || lowerMsg.includes("call") || lowerMsg.includes("meeting")) {
      intent = "appointment_request";
    }
    if (lowerMsg.includes("invoice") || lowerMsg.includes("payment") || lowerMsg.includes("quote")) {
      intent = "invoice_request";
    }

    // ─── Step 3: Extract lead qualification signals ───────────────────────────
    const budgetMatch = message.match(/\$[\d,]+|\d+k|\d+,\d{3}/i);
    if (budgetMatch) {
      leadSignals.budget = parseInt(budgetMatch[0].replace(/[$k,]/g, "")) * (budgetMatch[0].includes("k") ? 1000 : 1);
    }

    const timelineKeywords = ["urgent", "asap", "this week", "next week", "next month", "q1", "q2", "q3", "q4", "2026", "3 weeks"];
    const foundTimeline = timelineKeywords.find(t => lowerMsg.includes(t));
    if (foundTimeline) leadSignals.timeline = foundTimeline;

    // ─── Step 4: Determine lead score & status ────────────────────────────────
    let leadScore = 20;
    let leadStatus = "COLD";

    if (intent === "lead_inquiry" || intent === "appointment_request") leadScore += 30;
    if (leadSignals.budget && leadSignals.budget >= 5000) leadScore += 25;
    if (leadSignals.timeline && ["urgent", "asap", "this week", "next week", "3 weeks"].includes(leadSignals.timeline)) leadScore += 20;

    if (leadScore >= 70) leadStatus = "HOT";
    else if (leadScore >= 45) leadStatus = "WARM";

    // ─── Step 5: Build AI response ────────────────────────────────────────────
    // In production: call OpenAI/Anthropic API with the KB context
    // const completion = await openai.chat.completions.create({ ... })

    let response = "";
    let agentAction = "";

    if (relevantKB.length > 0) {
      // Ground response in KB
      const topKB = relevantKB[0];
      response = topKB.answer;
      agentAction = `Retrieved ${relevantKB.length} KB entries for grounding`;
    } else {
      // Fallback responses by intent
      const fallbacks: Record<string, string> = {
        pricing_inquiry: "Our services start at $3,000 for smaller engagements and go up to $20,000+ for full enterprise projects. I'd be happy to give you a more specific quote — could you tell me more about what you're looking for?",
        lead_inquiry: "That's exactly the kind of challenge we help businesses with! To make sure I point you to the right solution, could you tell me a bit more about your situation — specifically your timeline and budget range?",
        appointment_request: "Absolutely! I can help schedule a discovery call. Our team is typically available Monday–Friday, 9am–5pm ET. What time works best for you?",
        invoice_request: "I'd be happy to prepare a quote for you. Once you share the scope of work, I can have a detailed proposal ready within 24 hours.",
        general_question: "Thanks for reaching out! I'm here to help. Could you tell me a bit more about what you're looking for so I can give you the most relevant information?",
      };
      response = fallbacks[intent] || fallbacks.general_question;
      agentAction = `Intent classified as: ${intent}`;
    }

    // ─── Step 6: Return structured response ───────────────────────────────────
    return NextResponse.json({
      response,
      intent,
      leadScore,
      leadStatus,
      leadSignals,
      agentAction,
      kbEntriesUsed: relevantKB.length,
      suggestedActions: [
        ...(intent === "appointment_request" ? [{ type: "SCHEDULE_APPOINTMENT", label: "Schedule appointment" }] : []),
        ...(intent === "invoice_request" ? [{ type: "CREATE_INVOICE", label: "Generate quote" }] : []),
        ...(leadScore >= 70 ? [{ type: "NOTIFY_OWNER", label: "Alert business owner" }] : []),
      ],
    });
  } catch (error) {
    console.error("Agent error:", error);
    return NextResponse.json({ error: "Agent processing failed" }, { status: 500 });
  }
}
