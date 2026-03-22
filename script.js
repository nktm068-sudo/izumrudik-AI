// --- МАГИЧЕСКИЕ КУКИ НА 2 ГОДА ---
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        // Рассчитываем время: 730 дней * 24 часа * 60 мин * 60 сек * 1000 мс
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// --- ОБНОВЛЕННАЯ РЕГИСТРАЦИЯ НИКИТЫ ---
function initAuth() {
    const savedName = getCookie('emerald_username');
    const savedPass = getCookie('emerald_password');

    if (!savedName) {
        authScreen.style.display = 'flex';
        regBtn.onclick = () => {
            const name = regNameInput.value.trim();
            const pass = regPassInput.value.trim();
            
            if (name && pass) {
                // СОХРАНЯЕМ НА 730 ДНЕЙ (2 ГОДА!) 💎
                setCookie('emerald_username', name, 730);
                setCookie('emerald_password', pass, 730);
                
                alert("Emerald ID создан на 2 года! Привет, " + name);
                location.reload();
            }
        };
    } else {
        const passCheck = prompt(`Привет, ${savedName}! Введи пароль Emerald ID (Срок жизни аккаунта: 2 года):`);
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
