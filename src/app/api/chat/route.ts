import { NextResponse } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `أنت مساعد ذكي مخصص لنادي "جاب لاب للملاكمة" (Jab Lab Boxing Club) في الأردن.

معلومات عن النادي:
- الموقع الجغرافي: عمّان، الأردن (Amman, Jordan) - مجمع الرياضة الراقي.
- رابط الموقع على خرائط جوجل (Google Maps): https://maps.google.com/?q=Jab+Lab+Boxing+Amman+Jordan
- كباتن النادي: 
  - الكابتن عدي هنداوي (الكابتن الأولمبي ومدرب المنتخب الوطني).
  - الكابتن محمد التلاوي (لاعب المنتخب الوطني ومختص المهارات).
  - الكابتن عبدالله البوريني (المدرب الدولي وبطل المملكة).
  - الكابتن ضياء الحارثي (مختص الإعداد البدني وبطل المملكة).
- الأسعار والاشتراكات (أعطِ الأسعار عند السؤال عنها فقط):
  - اشتراك شهر كامل (غير محدود): 75 دينار أردني.
  - باقة الأبطال (3 أشهر): 195 دينار أردني.
  - باقة التدريب الخاص VIP (10 حصص 1-on-1): 250 دينار أردني.
  - تذكرة دخول يومي / حصة واحدة: 15 دينار أردني.

تعليمات هامة جداً:
1. اللغة: يجب أن تجيب بنفس لغة المستخدم. إذا تحدث بالإنجليزية أجب بالإنجليزية، وإذا تحدث بالعربية أجب بالعربية (بلهجة أردنية مبسطة أو فصحى).
2. الترحيب والرسائل القصيرة: إذا قام المستخدم بإلقاء التحية فقط أو أرسل رسالة مبهمة، بادر بالترحيب واطرح عليه خيارات للمساعدة بدلاً من سؤاله "كيف يمكنني مساعدتك؟" فقط.
3. أزرار الاقتراحات (مهم جداً): في نهاية كل رسالة لك (حتى رسائل الترحيب)، يجب عليك توفير 2 أو 3 خيارات ذكية يمكن للمستخدم النقر عليها لرد سريع. استخدم الصيغة التالية بالضبط لكل خيار:
[SUGGESTION: نص الاقتراح هنا]
مثال: 
[SUGGESTION: كم أسعار الاشتراكات؟]
[SUGGESTION: من هم كباتن النادي؟]
تأكد أن الاقتراحات منطقية وتناسب سياق الحوار الحالي ولغة المستخدم.
4. الإيجاز: أجب بشكل مختصر ومفيد جداً، لا تطل في الكلام.
5. زر الواتساب: لا تقم بإرسال الكلمة المفتاحية [WHATSAPP_BUTTON] إلا في الحالات التالية فقط:
   - إذا سألك المستخدم صراحة عن كيفية التواصل مع الإدارة.
   - إذا طلب حجز حصة فعلية.
   - إذا سأل عن شيء لا تعرفه وتطلب مساعدة بشرية.
6. لا تخترع أي معلومات عن الأسعار أو الكباتن غير المذكورة أعلاه.`;

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
        model: "deepseek/deepseek-chat", // DeepSeek V3 (fastest and cheapest)
        messages: formattedMessages,
        temperature: 0.5,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenRouter Error:", errText);
      throw new Error("Failed to fetch from OpenRouter: " + errText);
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
