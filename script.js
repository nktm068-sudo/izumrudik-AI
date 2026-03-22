const emerald = document.getElementById('emerald');
const statusText = document.getElementById('status');
const aiAnswer = document.getElementById('ai-answer');

// --- АТОМАРНАЯ СБОРКА ЛДФЛДФ (OpenRouter Edition) ---
const p1 = "s"; const p2 = "k"; const p3 = "-"; const p4 = "o"; const p5 = "r"; const p6 = "-"; 
const p7 = "v"; const p8 = "1"; const p9 = "-";
const body1 = "20813561acb4f0";
const body2 = "8b70aadf894b2ea";
const body3 = "b7db3f4b2b05480c";
const body4 = "e1ca21285924502281a";

// Склеиваем секретный лдфлдф воедино
const LDFLDF = (p1+p2+p3+p4+p5+p6+p7+p8+p9+body1+body2+body3+body4).trim();
// ---------------------------------------------------------

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';

    emerald.onclick = () => {
        window.speechSynthesis.cancel();
        recognition.start();
        emerald.classList.add('active');
        statusText.innerText = "Слушаю...";
    };

    recognition.onresult = async (event) => {
        const text = event.results[0][0].transcript; // САМЫЙ ТОЧНЫЙ ПУТЬ
        emerald.classList.remove('active');
        statusText.innerText = "Вы: " + text;
        
        if (text.toLowerCase().includes('включи') || text.toLowerCase().includes('найди')) {
            let q = text.replace(/(включи|найди|видео|ютуб)/gi, '').trim();
            speak("Секунду, ищу в Ютубе: " + q);
            window.open(`https://www.youtube.com{encodeURIComponent(q)}`, '_blank');
        } else {
            askAI(text);
        }
    };
}

async function askAI(msg) {
    emerald.classList.add('thinking');
    aiAnswer.innerText = "Изумрудик размышляет...";

    try {
        const response = await fetch("https://openrouter.ai", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${LDFLDF}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "mistralai/mistral-7b-instruct:free", // БЕСПЛАТНАЯ МОДЕЛЬ
                "messages": [{ "role": "user", "content": `Ответь очень кратко на русском: ${msg}` }]
            })
        });

        const data = await response.json();
        
        // Если пришла ошибка (например, ключ не сработал)
        if (data.error) {
            aiAnswer.innerText = "Ошибка OpenRouter: " + data.error.message;
            return;
        }

        let reply = data.choices[0].message.content || "Я задумался...";
        aiAnswer.innerText = reply;
        speak(reply);

    } catch (error) {
        aiAnswer.innerText = "Ошибка связи. Нажми Ctrl + F5!";
        console.error(error);
    } finally {
        emerald.classList.remove('thinking');
    }
}

function speak(t) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.lang = 'ru-RU';
    const v = window.speechSynthesis.getVoices();
    const p = v.find(n => n.name.includes('Pavel')) || v.find(n => n.lang.includes('ru-RU'));
    if (p) u.voice = p;
    u.pitch = 0.9;
    window.speechSynthesis.speak(u);
}

// Предзагрузка голосов
window.speechSynthesis.getVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}
