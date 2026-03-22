const emerald = document.getElementById('emerald');
const statusText = document.getElementById('status');
const aiAnswer = document.getElementById('ai-answer');

// Твой лфдлфд
const p1 = "hf_";
const p2 = "jHKWjQnesubsovBNrnw"; 
const p3 = "OJJWJjotlfddfdv";
const TOKEN = p1 + p2 + p3;

// 1. Настройка распознавания речи
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;

    emerald.onclick = () => {
        window.speechSynthesis.cancel(); // Остановить прошлую речь
        recognition.start();
        emerald.classList.add('active');
        statusText.innerText = "Павел слушает...";
    };

    recognition.onresult = async (event) => {
        const text = event.results[0][0].transcript; // Исправленный путь к тексту
        emerald.classList.remove('active');
        statusText.innerText = "Вы: " + text;
        
        // Команды для YouTube
        if (text.toLowerCase().includes('включи') || text.toLowerCase().includes('найди')) {
            let query = text.replace(/(включи|найди|видео|на ютубе|ютуб)/gi, '').trim();
            speak("Ищу в Ютубе: " + query);
            window.open(`https://www.youtube.com{encodeURIComponent(query)}`, '_blank');
        } else {
            askAI(text);
        }
    };
}

// 2. Общение с нейросетью Llama-3
async function askAI(message) {
    emerald.classList.add('thinking');
    aiAnswer.innerText = "Изумрудик думает...";

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
                    inputs: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>Ты - помощник Изумрудик. Отвечай кратко на русском.<|eot_id|><|start_header_id|>user<|end_header_id|>${message}<|eot_id|><|start_header_id|>assistant<|end_header_id|>`,
                    parameters: { max_new_tokens: 150, temperature: 0.7 }
                }),
            }
        );
        
        const result = await response.json();
        
        if (result.error) {
            let msg = "Я просыпаюсь. Попробуй через 15 секунд.";
            aiAnswer.innerText = msg;
            speak(msg);
            return;
        }

        // Вырезаем только ответ ассистента
        let fullText = result[0].generated_text;
        let reply = fullText.split('assistant<|end_header_id|>').pop().trim();
        
        aiAnswer.innerText = reply;
        speak(reply);
    } catch (error) {
        aiAnswer.innerText = "Ошибка связи. Попробуй еще раз!";
    } finally {
        emerald.classList.remove('thinking');
    }
}

// 3. Функция озвучки Павла (Windows 10)
function speak(text) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    // Ищем Павла
    const pavel = voices.find(v => v.name.includes('Pavel')) || 
                  voices.find(v => v.lang.includes('ru-RU'));

    if (pavel) {
        utterance.voice = pavel;
    }

    utterance.pitch = 0.9; // Мужской тон
    utterance.rate = 1.0;
    utterance.lang = 'ru-RU';

    window.speechSynthesis.speak(utterance);
}

// Постоянная подгрузка голосов для браузера
window.speechSynthesis.getVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}
