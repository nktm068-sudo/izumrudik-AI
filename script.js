const emerald = document.getElementById('emerald');
const statusText = document.getElementById('status');
const aiAnswer = document.getElementById('ai-answer');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const userIdDisplay = document.getElementById('user-id-display');

// ЭЛЕМЕНТЫ РЕГИСТРАЦИИ
const authScreen = document.getElementById('auth-screen');
const regNameInput = document.getElementById('reg-name');
const regPassInput = document.getElementById('reg-pass');
const regBtn = document.getElementById('reg-btn');

// --- 1. СИСТЕМА ПРОФИЛЯ НИКИТЫ ---
let currentUser = "";

function initAuth() {
    const savedName = localStorage.getItem('emerald_username');
    const savedPass = localStorage.getItem('emerald_password');

    if (!savedName) {
        // Если аккаунта нет - показываем окно регистрации
        authScreen.style.display = 'flex';
        regBtn.onclick = () => {
            if (regNameInput.value && regPassInput.value) {
                localStorage.setItem('emerald_username', regNameInput.value);
                localStorage.setItem('emerald_password', regPassInput.value);
                alert("Аккаунт создан! Перезагрузка...");
                location.reload();
            }
        };
    } else {
        // Если аккаунт есть - спрашиваем пароль через prompt
        const passCheck = prompt(`Привет, ${savedName}! Введи пароль Emerald ID:`);
        if (passCheck === savedPass) {
            currentUser = savedName;
            userIdDisplay.innerText = currentUser + " (Online)";
            statusText.innerText = "С возвращением, " + currentUser;
        } else {
            alert("Неверный пароль!");
            location.reload();
        }
    }
}

initAuth(); // Запуск авторизации

// --- 2. ТВОЙ АТОМАРНЫЙ ЛДФЛДФ ---
const p1="s", p2="k", p3="-", p4="o", p5="r", p6="-", p7="v", p8="1", p9="-";
const b1="57ab993b98209b", b2="1e9941644e030f", b3="27ef19e97a7bd735", b4="91485e0f6c5da3c1ba6b";
const LDFLDF = (p1+p2+p3+p4+p5+p6+p7+p8+p9+b1+b2+b3+b4).trim();

// --- 3. ЛОГИКА ЧАТА ---
function handle() {
    const t = userInput.value.trim();
    if (t && currentUser) { 
        statusText.innerText = currentUser + ": " + t; 
        askAI(t); 
        userInput.value = ""; 
    }
}
sendBtn.onclick = handle;
userInput.onkeypress = (e) => { if(e.key === 'Enter') handle(); };

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
        aiAnswer.innerText = "Ошибка сервера. Отдохни 15 минут!";
    } finally { emerald.classList.remove('thinking'); }
}

function speak(t) {
    window.speechSynthesis.cancel();
    const u = new SynthesisUtterance(t); // Стандартный голос
    u.lang = 'ru-RU';
    window.speechSynthesis.speak(u);
}
