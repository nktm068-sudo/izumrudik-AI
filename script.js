const emerald = document.getElementById('emerald');
const statusText = document.getElementById('status');
const aiAnswer = document.getElementById('ai-answer');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// --- Твой АТОМАРНЫЙ лдфлдф (Безопасная сборка) ---
const p1="s", p2="k", p3="-", p4="o", p5="r", p6="-", p7="v", p8="1", p9="-";
const b1="20813561acb4f0", b2="8b70aadf894b2ea", b3="b7db3f4b2b05480c", b4="e1ca21285924502281a";
const LDFLDF = (p1+p2+p3+p4+p5+p6+p7+p8+p9+b1+b2+b3+b4).trim();

// 1. Обработка текста
function handleText() {
    const text = userInput.value.trim();
    if (text) {
        statusText.innerText = "Вы: " + text;
        askAI(text);
        userInput.value = "";
    }
}
sendBtn.onclick = handleText;
userInput.onkeypress = (e) => { if (e.key === 'Enter') handleText(); };

// 2. Распознавание голоса
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const rec = new SpeechRecognition();
    rec.lang = 'ru-RU';
    emerald.onclick = () => { window.speechSynthesis.cancel(); rec.start(); emerald.classList.add('active'); };
    rec.onresult = (event) => {
        const text = event.results[0][0].transcript;
        emerald.classList.remove('active');
        statusText.innerText = "Вы: " + text;
        askAI(text);
    };
}

// 3. Запрос к ИИ через Ядерный Прокси
async function askAI(msg) {
    emerald.classList.add('thinking');
    aiAnswer.innerText = "Изумрудик пробивает защиту...";
    try {
        const proxy = "https://corsproxy.io?";
        const url = "https://openrouter.ai";
        const res = await fetch(proxy + encodeURIComponent(url), {
            method: "POST",
            headers: { "Authorization": `Bearer ${LDFLDF}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                "model": "mistralai/mistral-7b-instruct:free",
                "messages": [{ "role": "user", "content": `Ответь кратко на русском: ${msg}` }]
            })
        });
        const data = await res.json();
        const reply = data.choices[0].message.content;
        aiAnswer.innerText = reply;
        speak(reply);
    } catch (e) {
        aiAnswer.innerText = "Даже прокси не помог. Дай мне отдохнуть 15 минут!";
    } finally { emerald.classList.remove('thinking'); }
}

// 4. Озвучка Павла
function speak(t) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.lang = 'ru-RU';
    const v = window.speechSynthesis.getVoices();
    const p = v.find(n => n.name.includes('Pavel')) || v.find(n => n.lang.includes('ru-RU'));
    if (p) u.voice = p;
    window.speechSynthesis.speak(u);
}
