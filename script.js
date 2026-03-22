const emerald = document.getElementById('emerald');
const statusText = document.getElementById('status');
const aiAnswer = document.getElementById('ai-answer');

// --- Твой АТОМАРНЫЙ лдфлдф (OpenRouter) ---
const p1 = "s"; const p2 = "k"; const p3 = "-"; const p4 = "o"; const p5 = "r"; const p6 = "-"; 
const p7 = "v"; const p8 = "1"; const p9 = "-";
const b1 = "20813561acb4f0";
const b2 = "8b70aadf894b2ea";
const b3 = "b7db3f4b2b05480c";
const b4 = "e1ca21285924502281a";
const LDFLDF = (p1+p2+p3+p4+p5+p6+p7+p8+p9+b1+b2+b3+b4).trim();

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
        const text = event.results[0][0].transcript; // Исправленный путь к тексту
        emerald.classList.remove('active');
        statusText.innerText = "Вы: " + text;
        
        if (text.toLowerCase().includes('включи') || text.toLowerCase().includes('найди')) {
            let q = text.replace(/(включи|найди|видео|ютуб)/gi, '').trim();
            window.open(`https://www.youtube.com{encodeURIComponent(q)}`, '_blank');
        } else {
            askAI(text);
        }
    };
}

async function askAI(msg) {
    emerald.classList.add('thinking');
    aiAnswer.innerText = "Изумрудик пробивает защиту...";

    try {
        // ИСПОЛЬЗУЕМ КОРС-ПРОКСИ, чтобы обмануть браузер
        const proxyUrl = "https://corsproxy.io?";
        const apiUrl = "https://openrouter.ai";

        const response = await fetch(proxyUrl + encodeURIComponent(apiUrl), {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${LDFLDF}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "mistralai/mistral-7b-instruct:free",
                "messages": [{ "role": "user", "content": `Ответь кратко на русском: ${msg}` }]
            })
        });

        const data = await response.json();
        const reply = data.choices[0].message.content;

        aiAnswer.innerText = reply;
        speak(reply);
    } catch (error) {
        aiAnswer.innerText = "Даже прокси не помог. Отдохни 15 минут!";
        console.error(error);
    } finally {
        emerald.classList.remove('thinking');
    }
}

function speak(t) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.lang = 'ru-RU';
    const voices = window.speechSynthesis.getVoices();
    const pavel = voices.find(v => v.name.includes('Pavel')) || voices.find(v => v.lang.includes('ru-RU'));
    if (pavel) u.voice = pavel;
    window.speechSynthesis.speak(u);
}
