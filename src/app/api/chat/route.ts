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
        model: "deepseek/deepseek-chat", // DeepSeek V3
        messages: formattedMessages,
        temperature: 0.5,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from OpenRouter");
    }

    const data = await response.json();
    return NextResponse.json({ reply: data.choices[0].message.content });
    
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "عذراً، حدث خطأ في النظام. يرجى المحاولة لاحقاً." },
      { status: 500 }
    );
  }
}
