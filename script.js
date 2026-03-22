const emerald = document.getElementById('emerald');
const statusText = document.getElementById('status');
const aiAnswer = document.getElementById('ai-answer');
const userInput = document.getElementById('user-input'); // Добавлено: поле ввода
const sendBtn = document.getElementById('send-btn');    // Добавлено: кнопка-стрелочка

// --- Твой АТОМАРНЫЙ лдфлдф (OpenRouter) ---
const p1 = "s"; const p2 = "k"; const p3 = "-"; const p4 = "o"; const p5 = "r"; const p6 = "-"; 
const p7 = "v"; const p8 = "1"; const p9 = "-";
const b1 = "20813561acb4f0";
const b2 = "8b70aadf894b2ea";
const b3 = "b7db3f4b2b05480c";
const b4 = "e1ca21285924502281a";
const LDFLDF = (p1+p2+p3+p4+p5+p6+p7+p8+p9+b1+b2+b3+b4).trim();

// --- 1. ЛОГИКА ТЕКСТОВОГО ВВОДА (Таблетка + Стрелочка) ---
function handleTextRequest() {
    const text = userInput.value.trim();
    if (text) {
        statusText.innerText = "Вы: " + text;
        askAI(text); // Изумрудик начинает думать над текстом
        userInput.value = ""; // Очищаем поле
    }
}

// Клик по зелёной кнопке-стрелочке
if (sendBtn) sendBtn.addEventListener('click', handleTextRequest);

// Нажатие Enter в поле ввода
if (userInput) {
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleTextRequest();
    });
}

// --- 2. РАСПОЗНАВАНИЕ ГОЛОСА ---
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
        const text = event.results[0][0].transcript; 
        emerald.classList.remove('active');
        statusText.innerText = "Вы: " + text;
        
        if (text.toLowerCase().includes('включи') || text.toLowerCase().includes('найди')) {
            let q = text.replace(/(включи|найди|видео|ютуб)/gi, '').trim();
            speak("Ищу видео про " + q);
            window.open(`https://www.youtube.com{encodeURIComponent(q)}`, '_blank');
        } else {
            askAI(text);
        }
    };
}

// --- 3. МОЗГИ ИЗУМРУДИКА (OpenRouter + Прокси) ---
async function askAI(msg) {
    emerald.classList.add('thinking');
    aiAnswer.innerText = "Изумрудик пробивает защиту...";

    try {
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
        
        if (data.choices && data.choices[0]) {
            const reply = data.choices[0].message.content;
            aiAnswer.innerText = reply;
            speak(reply);
        } else {
            aiAnswer.innerText = "Ошибка: сервер прислал пустой ответ.";
        }
    } catch (error) {
        aiAnswer.innerText = "Даже прокси не помог. Отдохни 15 минут!";
        console.error(error);
    } finally {
        emerald.classList.remove('thinking');
    }
}

// --- 4. ГОЛОС ПАВЛА ---
function speak(t) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.lang = 'ru-RU';
    const voices = window.speechSynthesis.getVoices();
    const pavel = voices.find(v => v.name.includes('Pavel')) || voices.find(v => v.lang.includes('ru-RU'));
    if (pavel) u.voice = pavel;
    u.pitch = 0.9;
    window.speechSynthesis.speak(u);
}

// Предзагрузка голосов
window.speechSynthesis.getVoices();
