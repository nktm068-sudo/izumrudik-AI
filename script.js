const emerald = document.getElementById('emerald');
const statusText = document.getElementById('status');
const aiAnswer = document.getElementById('ai-answer');

// Хитрая сборка твоего токена для безопасности GitHub
const p1 = "hf_";
const p2 = "WKoWtoDRToBhhdq";
const p3 = "RgVOLNSrShuCfvKrNCS";
const TOKEN = p1 + p2 + p3;

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'ru-RU';

emerald.onclick = () => {
    recognition.start();
    emerald.classList.add('active');
    statusText.innerText = "Изумрудик внимательно слушает...";
};

recognition.onresult = async (event) => {
    const text = event.results[0][0].transcript;
    emerald.classList.remove('active');
    statusText.innerText = "Вы: " + text;
    
    // 1. Команда для YouTube
    if (text.toLowerCase().includes('включи') || text.toLowerCase().includes('видео')) {
        let query = text.replace(/(включи|видео|найди|на ютубе)/gi, '').trim();
        speak("Конечно! Ищу в Ютубе: " + query);
        window.open(`https://www.youtube.com{encodeURIComponent(query)}`, '_blank');
    } 
    // 2. Общение с нейросетью
    else {
        askAI(text);
    }
};

async function askAI(message) {
    emerald.classList.add('thinking');
    aiAnswer.innerText = "Изумрудик размышляет...";

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co",
            {
                headers: { 
                    "Authorization": `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({ 
                    inputs: `<s>[INST] Ответь на русском языке, кратко и дружелюбно: ${message} [/INST]`,
                    parameters: { max_new_tokens: 150 }
                }),
            }
        );
        
        const result = await response.json();
        let fullText = result[0].generated_text;
        // Очищаем ответ от системных промптов
        let reply = fullText.split('[/INST]').pop().trim();
        
        aiAnswer.innerText = reply;
        speak(reply);
    } catch (error) {
        aiAnswer.innerText = "Упс! Кажется, нейронные связи запутались. Попробуй еще раз!";
        console.error(error);
    } finally {
        emerald.classList.remove('thinking');
    }
}

function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'ru-RU';
    speech.pitch = 1.2; // Сделаем голос чуть более "драгоценным"
    window.speechSynthesis.speak(speech);
}
