$(document).ready(function () {
    const apiKey = 'API GOOGLE TRADUCTOR';
    const sourceText = document.getElementById('sourceText');
    const targetLanguageSelect = document.getElementById('targetLanguageSelect');
    const translationResult = document.getElementById('translationResult');
    const detectedLanguage = document.getElementById('detectedLanguage');
    const translateButton = document.getElementById('translateButton');
    const options = Array.from(targetLanguageSelect.options);

    options.sort((a, b) => a.text.localeCompare(b.text));
    targetLanguageSelect.innerHTML = '';

    options.forEach((option) => {
        targetLanguageSelect.appendChild(option);
    });

    let detectedLang = ''; // Variable global para almacenar el idioma detectado

    sourceText.addEventListener('input', function () {
        const textToDetect = sourceText.value;

        $.ajax({
            url: `https://translation.googleapis.com/language/translate/v2/detect?key=${apiKey}&q=${textToDetect}`,
            method: 'GET',
            contentType: 'application/json',
            success: function (data) {
                detectedLang = data.data.detections[0][0].language;

                if (detectedLang) {
                    detectedLanguage.textContent = `Idioma Detectado: ${getLanguageName(detectedLang)}`;
                    translateButton.disabled = false; // Habilita el botón de traducción
                } else {
                    detectedLanguage.textContent = 'No se pudo detectar el idioma.';
                    translateButton.disabled = true; // Deshabilita el botón de traducción
                }
            },
            error: function (error) {
                console.error('Error en la detección de idioma:', error);
                translateButton.disabled = true; // En caso de error, deshabilita el botón de traducción
            }
        });
    });

    translateButton.addEventListener('click', function () {
        const textToTranslate = sourceText.value;
        const targetLang = targetLanguageSelect.value;

        if (targetLang) {
            $.ajax({
                url: `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    q: textToTranslate,
                    source: detectedLang, // Usa el idioma detectado
                    target: targetLang
                }),
                success: function (data) {
                    const translatedText = data.data.translations[0].translatedText;
                    translationResult.textContent = translatedText;
                },
                error: function (error) {
                    console.error('Error en la traducción:', error);
                }
            });
        } else {
            console.error('Selecciona un idioma de destino válido.');
        }
    });

    function getLanguageName(langCode) {
        switch (langCode) {
            case 'en':
                return 'Inglés';
            case 'zh-CN':
                return 'Mandarín';
            case 'es':
                return 'Español';
            case 'fr':
                return 'Francés';
            case 'it':
                return 'Italiano';
            case 'pt':
                return 'Portugués';
            case 'ru':
                return 'Ruso';
            case 'ar':
                return 'Árabe';
            case 'hi':
                return 'Hindú';
            case 'de':
                return 'Alemán'; 
            case 'ja':
                return 'Japonés'; 
            default:
                return 'Desconocido';
        }
    }
});
