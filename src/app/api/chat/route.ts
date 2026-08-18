import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `أنت مساعد ذكي مخصص لنادي "جاب لاب للملاكمة" (Jab Lab Boxing Club) في الأردن.
دورك هو الرد على استفسارات المشتركين والزوار بأسلوب محترم، ودود، وباللهجة الأردنية أو العربية الفصحى المبسطة.

معلومات عن النادي:
- كباتن النادي: 
  - الكابتن عدي هنداوي (الكابتن الأولمبي ومدرب المنتخب الوطني).
  - الكابتن محمد التلاوي (لاعب المنتخب الوطني ومختص المهارات).
  - الكابتن عبدالله البوريني (المدرب الدولي وبطل المملكة).
  - الكابتن ضياء الحارثي (مختص الإعداد البدني وبطل المملكة).
- الأسعار والاشتراكات:
  - التسجيل لأول مرة (شخص جديد): 50 دينار أردني (شامل قفازات مجانية).
  - الاشتراك الشهري العادي (للتجديد وبدون قفازات): 40 دينار أردني شهرياً.

تعليمات هامة جداً:
- أجب بشكل مختصر ومفيد، لا تطل في الكلام.
- إذا سألك المستخدم سؤالاً لا تعرف إجابته، أو كان بحاجة لمساعدة بشرية، أو أراد حجز حصة ولم تتمكن من ذلك، يجب عليك أن تنصحه بالتواصل مع الكباتن عبر الواتساب، ويجب أن تطبع الكلمة المفتاحية التالية تماماً كما هي في نص ردك:
[WHATSAPP_BUTTON]
سيقوم نظامنا بتحويل هذه الكلمة لزر أخضر للواتساب.
- إياك أن تخترع معلومات عن الأسعار أو الكباتن غير المذكورة أعلاه.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const formattedMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://jablab.mkq.one", // Optional, for OpenRouter analytics
        "X-Title": "Jab Lab Website", // Optional, for OpenRouter analytics
      },
      body: JSON.stringify({
        model: "qwen/qwen-2.5-72b-instruct:free", // Qwen 2.5 (Fast and Free)
        messages: formattedMessages,
        temperature: 0.5,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from OpenRouter");
    }

    // Parse SSE stream from OpenRouter and return raw text stream to client
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        if (!response.body) {
          controller.close();
          return;
        }
        
        const reader = response.body.getReader();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          // Keep the last incomplete line in the buffer
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
              try {
                const data = JSON.parse(trimmed.slice(6));
                const content = data.choices[0]?.delta?.content;
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch (e) {
                // Ignore incomplete JSON chunks
              }
            }
          }
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
    
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "عذراً، حدث خطأ في النظام. يرجى المحاولة لاحقاً." },
      { status: 500 }
    );
  }
}
