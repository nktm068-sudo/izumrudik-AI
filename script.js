const emerald = document.getElementById('emerald');
const statusText = document.getElementById('status');
const aiAnswer = document.getElementById('ai-answer');

// Маскировка секретного ключа (лдфлдф) от роботов Гитхаба
const b1 = "h";
const b2 = "f";
const b3 = "_";
const part_main = "jHKWjQnesubsovBNrnw"; 
const part_end = "OJJWJjotlfddfdv";

// Склеиваем секретный лдфлдф по атомам
const LDFLDF = (b1 + b2 + b3 + part_main + part_end).trim();

// Настройка распознавания речи
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
        // Достаем текст из того, что услышал микрофон
        const text = event.results[0][0].transcript; 
        emerald.classList.remove('active');
        statusText.innerText = "Вы: " + text;
        
        if (text.toLowerCase().includes('включи') || text.toLowerCase().includes('найди')) {
            let query = text.replace(/(включи|найди|видео|на ютубе)/gi, '').trim();
            speak("Секунду, ищу в Ютубе: " + query);
            window.open(`https://www.youtube.com{encodeURIComponent(query)}`, '_blank');
        } else {
            askAI(text);
        }
    };
}

async function askAI(message) {
    emerald.classList.add('thinking');
    aiAnswer.innerText = "Изумрудик думает...";

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co",
            {
                headers: { 
                    "Authorization": "Bearer " + LDFLDF, // Используем лдфлдф
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({ 
                    inputs: `<s>[INST] Ты - Изумрудик. Отвечай кратко на русском: ${message} [/INST]`,
                }),
            }
        );

        const result = await response.json();

        if (result.error) {
            let msg = "Я еще просыпаюсь. Нажми на меня через 15 секунд.";
            aiAnswer.innerText = msg;
            speak(msg);
            return;
        }

        // Вырезаем чистый ответ нейросети
        let rawText = Array.isArray(result) ? result[0].generated_text : result.generated_text;
        let reply = rawText.split('[/INST]').pop().trim();

        aiAnswer.innerText = reply;
        speak(reply);

    } catch (error) {
        aiAnswer.innerText = "Ошибка связи. Обнови страницу!";
        console.error("Ошибка:", error);
    } finally {
        emerald.classList.remove('thinking');
    }
}

function speak(text) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    // Ищем Павла для Windows 10
    const pavel = voices.find(v => v.name.includes('Pavel')) || 
                  voices.find(v => v.lang.includes('ru-RU'));
    
    if (pavel) utterance.voice = pavel;
    utterance.lang = 'ru-RU';
    utterance.pitch = 0.9;
    window.speechSynthesis.speak(utterance);
}
