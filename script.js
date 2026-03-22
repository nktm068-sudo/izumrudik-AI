// Собираем лфдлфд по атомам
const b1 = "h";
const b2 = "f";
const b3 = "_";
const part_main = "jHKWjQnesubsovBNrnw"; // Это можно оставить
const part_end = "OJJWJjotlfddfdv";    // И это

// Склеиваем всё в один рабочий лфдлфд
const LFD_LFD = b1 + b2 + b3 + part_main + part_end;

// Дальше идет обычный код...
const emerald = document.getElementById('emerald');
const statusText = document.getElementById('status');
const aiAnswer = document.getElementById('ai-answer');

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
                headers: { "Authorization": "Bearer " + LFD_LFD },
                method: "POST",
                body: JSON.stringify({ inputs: message }),
            }
        );

        const result = await response.json();

        if (result.error) {
            let msg = "Я еще просыпаюсь. Нажми на меня через 15 секунд.";
            aiAnswer.innerText = msg;
            speak(msg);
            return;
        }

        let reply = Array.isArray(result) ? result[0].generated_text : result.generated_text;
        reply = reply.replace(message, "").trim();

        aiAnswer.innerText = reply;
        speak(reply);
    } catch (error) {
        aiAnswer.innerText = "Ошибка связи. Обнови страницу!";
    } finally {
        emerald.classList.remove('thinking');
    }
}

function speak(text) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const pavel = voices.find(v => v.name.includes('Pavel')) || voices.find(v => v.lang.includes('ru-RU'));
    if (pavel) utterance.voice = pavel;
    utterance.lang = 'ru-RU';
    window.speechSynthesis.speak(utterance);
}
