// --- Page Guide Logic ---
const pageGuides = {
    'home': { text: "أهلاً بك في رحاب الحفيظ.. استشعر معاني الحفظ والأمان.", icon: "home" },
    'stories': { text: "قصص تروي لطف الله الخفي.. اقرأ واعتبر.", icon: "book-open" },
    'radio': { text: "أنصت بخشوع.. إذاعات قرآنية مباشرة.", icon: "radio" },
    'sakina': { text: "مساحة آمنة للفضفضة.. ابحث عن السكينة.", icon: "heart-handshake" },
    'wird': { text: "حصن نفسك.. تابع أذكارك ووردك اليومي بانتظام.", icon: "shield" }
};

let guideTimeout;

function showPageIntro(pageId) {
    const guide = document.getElementById('page-guide');
    const textEl = document.getElementById('guide-text');
    const iconEl = document.getElementById('guide-icon');
    const info = pageGuides[pageId];

    if (!info) return;

    // reset
    clearTimeout(guideTimeout);
    guide.classList.remove('active');

    // short delay to allow transition out if needed, then update and show
    setTimeout(() => {
        textEl.innerText = info.text;
        // Update icon logic
        iconEl.setAttribute('data-lucide', info.icon);
        lucide.createIcons();

        guide.classList.add('active');

        // Hide after 4 seconds
        guideTimeout = setTimeout(() => {
            guide.classList.remove('active');
        }, 4000);
    }, 300);
}

// --- Intro Logic & Tour Trigger ---
function closeIntro() {
    const intro = document.getElementById('intro-modal');
    const mainContent = document.getElementById('main-content');
    const checkbox = document.getElementById('dont-show-again');
    const video = document.querySelector('.intro-video');

    if (checkbox && checkbox.checked) {
        localStorage.setItem('hideIntro', 'true');
    }

    if (video) {
        video.pause();
        video.currentTime = 0;
    }

    intro.style.transition = 'opacity 0.8s ease';
    intro.style.opacity = '0';

    mainContent.style.filter = 'blur(0)';

    setTimeout(() => {
        intro.style.display = 'none';

        // Trigger the Tour ONLY on first visit ever (checked via localStorage)
        if (!localStorage.getItem('tourSeen')) {
            startTour();
            localStorage.setItem('tourSeen', 'true');
        } else {
            // If tour seen, show page guide
            showPageIntro('home');
        }
    }, 800);
}

// --- Driver.js Tour Logic ---
function startTour() {
    const driverObj = window.driver.js.driver({
        showProgress: true,
        animate: true,
        doneBtnText: 'تم',
        nextBtnText: 'التالي',
        prevBtnText: 'السابق',
        popoverClass: 'driverjs-theme', // Custom class for styling
        stagePadding: 20, // زيادة المسافة حول العنصر
        onDestroyStarted: () => {
            // When tour closes (finished or skipped), show the page guide
            driverObj.destroy();
            setTimeout(() => showPageIntro('home'), 500);
        },
        steps: [
            // --- 1. WELCOME & HEADER NAVIGATION ---
            {
                element: '.brand-name',
                popover: {
                    title: 'الحفيظ',
                    description: 'مرحباً بك.. لنأخذ جولة سريعة للتعرف على أركان هذا المكان.'
                },
                onHighlightStarted: () => { showPage('home'); }
            },
            {
                element: '#nav-stories',
                popover: {
                    title: 'مواقف وعِبر',
                    description: 'اضغط هنا لتنتقل إلى مكتبة القصص، حيث تجد قصصاً تروي لطف الله الخفي.'
                }
            },
            {
                element: '#nav-sakina',
                popover: {
                    title: 'متضايق؟',
                    description: 'وهنا مساحة "سكينة".. اضغط هنا إذا أردت أن تفضفض عما في خاطرك وتجد المواساة.'
                }
            },
            {
                element: '#nav-wird',
                popover: {
                    title: 'الورد اليومي',
                    description: 'أما هنا.. فهو حصنك. اضغط هنا لتتابع أذكارك وتضيف أورادك الخاصة.'
                }
            },

            // --- 2. HOME PAGE DETAILS ---
            {
                element: '#orb-container',
                popover: {
                    title: 'آيات الحفظ',
                    description: 'في الصفحة الرئيسية، ستجد هذه الآيات تدور حولك.. تأملها لتستشعر الأمان.'
                },
                onHighlightStarted: () => { showPage('home'); }
            },

            // --- 3. STORIES PAGE DETAILS ---
            {
                element: '.tabs-container',
                popover: {
                    title: 'تصفح القصص',
                    description: 'الآن في صفحة القصص.. يمكنك التنقل بين "قصص الناس" و "قصص الأولين" من هنا.'
                },
                onHighlightStarted: () => { showPage('stories'); setStoryMode('users'); }
            },
            {
                element: '#stories-share-container',
                popover: {
                    title: 'شاركنا قصتك',
                    description: 'وهنا يمكنك كتابة قصتك.. واستخدم زر "تحسين الصياغة" ليقوم الذكاء الاصطناعي بتجميل أسلوب سردك.'
                },
                onHighlightStarted: () => {
                    setStoryMode('share');
                }
            },

            // --- 4. SAKINA PAGE DETAILS ---
            {
                element: '#sakina-card',
                popover: {
                    title: 'فضفضة',
                    description: 'في صفحة سكينة.. اكتب مشاعرك هنا بكل أريحية وصدق.'
                },
                onHighlightStarted: () => { showPage('sakina'); }
            },
            {
                element: '#sakina-btn-text',
                popover: {
                    title: 'التمس السكينة',
                    description: 'ثم اضغط هذا الزر.. ليقوم "الحفيظ" بمواساتك بآية وحديث واسم من أسماء الله يناسب حالتك تماماً.'
                }
            },

            // --- 5. WIRD PAGE DETAILS ---
            {
                element: '#add-wird-form',
                popover: {
                    title: 'تخصيص الورد',
                    description: 'في صفحة الورد.. يمكنك إضافة أي ذكر تريده وتحديد العدد المستهدف من هنا.'
                },
                onHighlightStarted: () => {
                    showPage('wird');
                    const form = document.getElementById('add-wird-form');
                    if (form.style.display !== 'block') toggleWirdForm();
                }
            },
            {
                element: '.progress-container',
                popover: {
                    title: 'تابع إنجازك',
                    description: 'وهنا سيظهر شريط تقدمك اليومي.. نسأل الله أن يتقبل منك.'
                }
            },

            // --- 6. FOOTER ---
            {
                element: 'footer',
                popover: {
                    title: 'في أي وقت',
                    description: 'يمكنك إعادة هذه الجولة من الزر الموجود هنا في الأسفل.'
                },
                onHighlightStarted: () => { showPage('home'); }
            }
        ]
    });
    driverObj.drive();
}

function restartTour() {
    localStorage.removeItem('tourSeen');
    localStorage.removeItem('hideIntro');
    closeIntro(); // This will trigger the tour check again
    startTour();
}

// --- Gemini API Configuration ---
const apiKey = "AIzaSyBh9e-NiJbxKLTPIqUlLdNQT7NkYwohPps"; // تم ربط المفتاح الخاص بك
const apiBaseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";

async function callGemini(prompt) {
    try {
        const response = await fetch(`${apiBaseUrl}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API Error:', errorData); // Log error for debugging
            throw new Error(`API Error: ${response.status}`);
        }
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Fetch failed:", error);
        throw error;
    }
}

// --- Custom Modal Logic ---
let pendingAction = null;

function showConfirm(message, action) {
    document.getElementById('confirm-message').innerText = message;
    document.getElementById('confirm-modal').style.display = 'flex';
    pendingAction = action;

    // Set Yes button action
    document.getElementById('confirm-yes-btn').onclick = function () {
        if (pendingAction) pendingAction();
        closeConfirmModal();
    };
}

function closeConfirmModal() {
    document.getElementById('confirm-modal').style.display = 'none';
    pendingAction = null;
}

// --- Stories Mode Logic ---
let currentStoryMode = 'users';

function setStoryMode(mode) {
    currentStoryMode = mode;
    const readContainer = document.getElementById('stories-read-container');
    const shareContainer = document.getElementById('stories-share-container');
    const btnUsers = document.getElementById('btn-mode-users');
    const btnHistory = document.getElementById('btn-mode-history');
    const btnShare = document.getElementById('btn-mode-share');
    const highlight = document.getElementById('tabs-highlight');

    // Reset active classes
    btnUsers.classList.remove('active');
    btnHistory.classList.remove('active');
    btnShare.classList.remove('active');

    // Handle Highlight Position based on mode and screen size
    const isMobile = window.innerWidth <= 768;

    if (mode === 'share') {
        readContainer.style.display = 'none';
        shareContainer.style.display = 'block';
        shareContainer.style.animation = 'fadeIn 0.5s ease-out';
        btnShare.classList.add('active');

        // Center Position
        highlight.style.transform = isMobile ? 'translateX(-100%)' : 'translateX(-100%)';
    } else {
        readContainer.style.display = 'block';
        shareContainer.style.display = 'none';
        readContainer.style.animation = 'fadeIn 0.5s ease-out';

        if (mode === 'users') {
            btnUsers.classList.add('active');
            // Right Position (Initial)
            highlight.style.transform = 'translateX(0)';
            renderStories('users');
        } else if (mode === 'history') {
            btnHistory.classList.add('active');
            // Left Position
            highlight.style.transform = isMobile ? 'translateX(-200%)' : 'translateX(-200%)';
            renderStories('history');
        }
    }
}

// --- Feature 1: Refine Story ---
async function refineStory() {
    const contentBox = document.getElementById('story-content');
    const text = contentBox.value;
    const loader = document.getElementById('refine-loader');
    const btnSpan = document.querySelector('#refine-btn span');
    const btnIcon = document.querySelector('#refine-btn i');

    if (!text || text.length < 10) {
        showStatus("الرجاء كتابة نص كافٍ للتحسين");
        return;
    }

    loader.style.display = 'block';
    if (btnSpan) btnSpan.style.opacity = '0.5';
    if (btnIcon) btnIcon.style.opacity = '0.5';

    try {
        const prompt = `أعد صياغة القصة التالية لتكون أكثر فصاحة وتأثيراً باللغة العربية، مع الحفاظ على المعنى الأصلي والمشاعر الصادقة، بدون إضافة مقدمات أو خاتمات، فقط النص المحسن: "${text}"`;
        let refinedText = await callGemini(prompt);
        refinedText = refinedText.replace(/<[^>]*>/g, '').replace(/```/g, '').trim();
        contentBox.value = refinedText;
        showStatus("تم تحسين الصياغة بنجاح");
    } catch (error) {
        console.error(error);
        showStatus("تعذر تحسين النص حالياً");
    } finally {
        loader.style.display = 'none';
        if (btnSpan) btnSpan.style.opacity = '1';
        if (btnIcon) btnIcon.style.opacity = '1';
    }
}

// --- Feature 2: Sakina Message (Updated Smart & Integrated) ---
async function getSakinaMessage() {
    const input = document.getElementById('sakina-input').value;
    const loader = document.getElementById('sakina-loader');
    const btnText = document.getElementById('sakina-btn-text');

    // Views
    const inputView = document.getElementById('sakina-input-view');
    const resultView = document.getElementById('sakina-result-view');
    const resultText = document.getElementById('sakina-text');

    if (!input) {
        showStatus("حدثنا بما في قلبك أولاً");
        return;
    }

    // Start Loading
    loader.style.display = 'block';
    btnText.style.display = 'none';

    try {
        const prompt = `أنت رفيق حكيم ومتعاطف. حلل مدخلات المستخدم التالية: "${input}".

                الحالة 1: إذا كان الكلام "سواليف" عامة (مثلاً عن رياضة، طقس، هوايات، أخبار عامة) وليس فيه شكوى أو هم:
                - رد عليه رد "خوي" وصديق بلهجة سعودية بيضاء ودية. تفاعل مع الموضوع بذكاء ومرح إذا لزم الأمر. لا داعي للمواساة الدينية هنا.

                الحالة 2: إذا كان الكلام فضفضة، هم، حزن، مشكلة، أو ضيق (Fadfada):
                - تقمص دور الأخ الناصح المحب (Spiritual Comforter).
                - اكتب رسالة متكاملة العناصر (مدمجة في فقرة واحدة متناسقة) بلهجة بيضاء دافئة:
                    1. المواساة: ابدأ بكلمات تطمن الخاطر وتفهم الألم.
                    2. الربط بالله: اذكر "اسم من أسماء الله الحسنى" يناسب المشكلة تماماً (مثلاً: الرزاق للفقر، الجبار للكسر، الودود للوحشة) واشرح بلطف كيف أن هذا الاسم هو مفتاح فرجه.
                    3. نور القرآن: اقتبس "آية قرآنية" تلمس هذا الجرح (ضعها بين قوسين).
                    4. الهدي النبوي: اذكر "حديث نبوي" يواسي أو يوجه في هذا الموقف. **شرط صارم جداً:** يجب أن يكون الحديث صحيحاً 100% ومخرجاً في "صحيح البخاري" أو "صحيح مسلم" حصراً. إذا لم تجد حديثاً في الصحيحين يناسب الموقف، اكتفِ بالآية ولا تذكر حديثاً ضعيفاً أو غير مؤكد.
                    5. التحفيز: اختم بدفعة أمل وحث على العمل والتوكل.

                تنبيهات فنية:
                - لا تستخدم أي كلمات إنجليزية أو رموز Markdown (مثل ** أو #).
                - اجعل الرد بليغاً ومختصراً (لا يتجاوز 6 جمل).`;

        let message = await callGemini(prompt);

        // Sanitization
        message = message.replace(/<[^>]*>/g, '')
            .replace(/[a-zA-Z]/g, '')
            .replace(/`/g, '')
            .replace(/\*/g, '') // Remove asterisks too
            .trim();

        // UI Transition: Input -> Result
        resultText.innerText = message;

        inputView.style.opacity = '0';
        setTimeout(() => {
            inputView.style.display = 'none';
            resultView.style.display = 'flex';
            // Small delay to trigger opacity transition
            setTimeout(() => {
                resultView.style.opacity = '1';
                lucide.createIcons(); // Refresh icons for the X button
            }, 50);
        }, 300);

    } catch (error) {
        showStatus("نعتذر، لم نتمكن من جلب الرسالة");
    } finally {
        loader.style.display = 'none';
        btnText.style.display = 'flex';
    }
}

function closeSakinaResult() {
    const inputView = document.getElementById('sakina-input-view');
    const resultView = document.getElementById('sakina-result-view');
    const inputField = document.getElementById('sakina-input');

    // UI Transition: Result -> Input
    resultView.style.opacity = '0';
    setTimeout(() => {
        resultView.style.display = 'none';
        inputView.style.display = 'block';
        inputField.value = ""; // Clear input for fresh start
        setTimeout(() => {
            inputView.style.opacity = '1';
        }, 50);
    }, 300);
}

// --- Core Application Logic ---
lucide.createIcons();

let stories = JSON.parse(localStorage.getItem('user_stories')) || [
    { author: "عبدالله", content: "كنت في سفر وكادت السيارة أن تنحرف، لكن بلطف الله وجدت الطريق مفتوحاً فجأة ونجوت بأعجوبة." },
    { author: "سارة", content: "تأخرت عن موعد طائرة، وحزنت كثيراً، ثم اكتشفت أن الطائرة واجهت مشكلة تقنية، فكان التأخير خيراً لي." }
];

// --- Quran Radio Logic ---
const stations = [
    // Live Radios from Saudi Arabia (Ensure HTTPS)
    { name: "إذاعة الحرم المكي - مباشر", url: "https://stream.radiojar.com/0tpy1h0kxtzuv" },
    { name: "إذاعة الحرم النبوي - مباشر", url: "https://stream.radiojar.com/4wqre23fytzuv" },

    // Top Saudi Reciters (Ensure HTTPS)
    { name: "ماهر المعيقلي", url: "https://backup.qurango.net/radio/maher" },
    { name: "ياسر الدوسري", url: "https://backup.qurango.net/radio/yasser_aldosari" },
    { name: "عبدالرحمن السديس", url: "https://backup.qurango.net/radio/abdulrahman_alsudaes" },
    { name: "سعود الشريم", url: "https://backup.qurango.net/radio/saud_alshuraim" },
    { name: "سعد الغامدي", url: "https://backup.qurango.net/radio/saad_alghamdi" },
    { name: "بندر بليلة", url: "https://backup.qurango.net/radio/bandar_balilah" },
    { name: "ناصر القطامي", url: "https://backup.qurango.net/radio/nasser_alqatami" },
    { name: "خالد الجليل", url: "https://backup.qurango.net/radio/khalid_aljileel" },
    { name: "عبدالله الجهني", url: "https://backup.qurango.net/radio/abdullah_aljohany" }
];

// Unlock AudioContext on mobile touch
document.addEventListener('touchstart', function () {
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}, { once: true });
document.addEventListener('click', function () {
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}, { once: true });

let currentStationIndex = -1;
let isPlaying = false;
let audioObj = document.getElementById('radio-audio');

// Web Audio API Context
let audioCtx;
let analyser;
let source;
let dataArray;
let animationId;

function initAudioContext() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64; // Small size for fewer bars (32 bins)
        analyser.smoothingTimeConstant = 0.9; // Smooths out the jitter

        // Connect audio element to analyser
        if (audioObj) {
            try {
                source = audioCtx.createMediaElementSource(audioObj);
                source.connect(analyser);
                analyser.connect(audioCtx.destination);
            } catch (e) {
                console.error("Error creating MediaElementSource (likely CORS):", e);
                // Fallback for CORS: The audio will play, but visualizer might be silent.
                // We can implement a fake visualizer here if needed, or valid CORS streams.
            }
        }

        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
    }
}

function renderStations() {
    const container = document.getElementById('stations-container');
    container.innerHTML = stations.map((station, index) => `
        <div class="station-card" onclick="playStation(${index})" id="station-${index}">
            <div class="icon-container">
                <i data-lucide="radio" style="width: 24px;"></i>
            </div>
            <div style="font-size: 0.9rem; font-weight: 600;">${station.name}</div>
        </div>
    `).join('');
    lucide.createIcons();
}

function playStation(index) {
    if (currentStationIndex === index && isPlaying) {
        toggleRadio();
        return;
    }

    currentStationIndex = index;
    const station = stations[index];

    // Update Text
    document.getElementById('current-station-name').innerText = station.name;
    document.getElementById('player-status').innerText = "جارٍ التحميل...";

    // Update Active Card Class
    document.querySelectorAll('.station-card').forEach(c => c.classList.remove('active'));
    document.getElementById(`station-${index}`).classList.add('active');

    // Setup Audio
    if (!audioObj) audioObj = document.getElementById('radio-audio');

    // Initialize Audio Context on user interaction
    initAudioContext();
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    audioObj.src = station.url;
    audioObj.play().then(() => {
        isPlaying = true;
        updatePlayerUI(true);
        startVisualizerLoop();
    }).catch(err => {
        console.error("Playback Error:", err);
        showStatus("عذراً، تعذر تشغيل هذه الإذاعة حالياً");
        updatePlayerUI(false);
    });
}

function toggleRadio() {
    if (!audioObj) return;

    if (isPlaying) {
        audioObj.pause();
        isPlaying = false;
        updatePlayerUI(false);
        stopVisualizerLoop();
    } else {
        if (currentStationIndex === -1) {
            // Play first station if none selected
            playStation(0);
        } else {
            initAudioContext();
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            audioObj.play();
            isPlaying = true;
            updatePlayerUI(true);
            startVisualizerLoop();
        }
    }
}

function updatePlayerUI(playing) {
    const statusText = document.getElementById('player-status');
    const playIcon = document.getElementById('play-icon');
    const visualizer = document.getElementById('radio-visualizer');

    if (playing) {
        statusText.innerText = "بث مباشر";
        statusText.style.color = "#4ade80"; // Light green
        playIcon.setAttribute('data-lucide', 'pause');
        visualizer.style.opacity = '0.9';
    } else {
        statusText.innerText = "متوقف";
        statusText.style.color = "rgba(255,255,255,0.6)";
        playIcon.setAttribute('data-lucide', 'play');
        // visualizer.style.opacity = '0'; // Don't hide completely, just stop anim
    }
    lucide.createIcons();
}

function createVisualizer() {
    const container = document.getElementById('radio-visualizer');
    // Ensure bars exist
    if (container.childElementCount > 0) return;

    container.innerHTML = '';
    const barCount = 33; // Odd number for perfect center

    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = '4px'; // Initial resting height
        container.appendChild(bar);
    }
}

function startVisualizerLoop() {
    if (!analyser || !dataArray) return;

    // Ensure visualizer bars are created
    createVisualizer();

    const bars = document.querySelectorAll('#radio-visualizer .bar');
    const barCount = bars.length;

    function animate() {
        if (!isPlaying) return;

        animationId = requestAnimationFrame(animate);

        analyser.getByteFrequencyData(dataArray);

        // Symmetrical Mapping: Center is Bass (Index 0 of dataArray)
        const centerIdx = Math.floor(barCount / 2);

        for (let i = 0; i < barCount; i++) {
            // Calculate distance from center (0 at center, higher at edges)
            const dist = Math.abs(i - centerIdx);

            // Map distance to frequency index (Low freq at center, High at edges)
            // We use smaller steps for data index to keep within bass/mid range mostly
            const dataIndex = Math.min(dist, dataArray.length - 1);

            const value = dataArray[dataIndex];
            const percent = (value / 255) * 100;
            const height = Math.max(5, percent * 0.8); // Scale down slightly to fit

            if (bars[i]) {
                bars[i].style.height = `${height}%`;
            }
        }
    }
    animate();
}

function stopVisualizerLoop() {
    if (animationId) cancelAnimationFrame(animationId);
    // Reset bars to resting state
    const bars = document.querySelectorAll('#radio-visualizer .bar');
    bars.forEach(bar => {
        bar.style.height = '4px';
    });
}


// Historical Stories Data (Hardcoded)
const historicalStories = [
    {
        title: "حفظ الله لنبيه في الغار",
        content: "عندما اختبأ النبي محمد ﷺ وصاحبه أبو بكر في غار ثور، وقف المشركون عند فم الغار، فقال أبو بكر بخوف: 'لو نظر أحدهم تحت قدميه لرآنا'. فرد عليه النبي بلسان الواثق: 'ما ظنك باثنين الله ثالثهما؟'. فصرف الله أبصارهم ونجاهم بمعجزة الحفظ الإلهي.",
        source: "السيرة النبوية"
    },
    {
        title: "نجاة يونس في بطن الحوت",
        content: "في ظلمات ثلاث: ظلمة الليل، وظلمة البحر، وظلمة بطن الحوت، نادى يونس ربه: 'لا إله إلا أنت سبحانك إني كنت من الظالمين'. فسمع الله نداءه واستجاب له ونجاه من الغم، وكذلك ينجي المؤمنين.",
        source: "قصص الأنبياء"
    },
    {
        title: "أم موسى والتوكل العظيم",
        content: "عندما خافت أم موسى على رضيعها من بطش فرعون، ألهمها الله أن تلقيه في اليم. قلب الأم يتفطر، لكن وعد الله كان أصدق: 'إنا رادوه إليك'. فحفظه الله في التابوت، وساقه إلى قصر عدوه ليربيه، ثم رده لأمه لتقر عينها.",
        source: "القرآن الكريم"
    },
    {
        title: "يا نار كوني برداً وسلاماً",
        content: "أُلقي إبراهيم عليه السلام في نار عظيمة أعدها قومه له، لكنه قال: 'حسبي الله ونعم الوكيل'. فأصدر الله أمره للنار التي طبيعتها الإحراق: 'يا نار كوني برداً وسلاماً على إبراهيم'، فحفظه الله ولم يمسه سوء.",
        source: "قصص الأنبياء"
    },
    {
        title: "كلا إن معي ربي سيهدين",
        content: "وقف موسى عليه السلام وقومه أمام البحر، وفرعون وجنوده من خلفهم، فقال أصحاب موسى: 'إنا لمدركون'. لكن يقين موسى بالحفيظ لم يهتز لحظة، قال: 'كلا إن معي ربي سيهدين'، فانفلق البحر وكان كل فرق كالطود العظيم.",
        source: "القرآن الكريم"
    },
    {
        title: "إذن لا يضيعنا",
        content: "ترك إبراهيم عليه السلام زوجته هاجر ورضيعها إسماعيل في وادي مكة القاحل بلا زرع ولا ماء. سألته: 'آلله أمرك بهذا؟' قال: نعم. فقالت بيقين الحفظ: 'إذن لا يضيعنا'. فحفظهم الله، وفجر لهم زمزم، وجعل أفئدة من الناس تهوي إليهم.",
        source: "قصص الأنبياء"
    },
    {
        title: "حفظ أهل الكهف",
        content: "فتية آمنوا بربهم وهربوا بدينهم إلى كهف مهجور، فحفظهم الله فيه 309 سنين، يقلبهم ذات اليمين وذات الشمال لتحفظ أجسادهم، ونشر عليهم الرعب ليحميهم من المتطفلين، حتى استيقظوا آية للعالمين.",
        source: "سورة الكهف"
    },
    {
        title: "يوسف من غيابات الجب إلى العرش",
        content: "ألقاه إخوته في البئر وهو طفل، وبيع بثمن بخس، وسجن ظلماً، لكن عين الله كانت ترعاه في كل خطوة. حفظه من كيد النساء، وعلمه تأويل الأحاديث، حتى مكنه في الأرض وجعله على خزائن مصر.",
        source: "سورة يوسف"
    },
    {
        title: "سفينة نوح وسط الأمواج",
        content: "بينما غرق كل شيء في الطوفان العظيم، كانت سفينة نوح عليه السلام تجري في موج كالجبال، محفوظة بأمر الله 'بسم الله مجريها ومرساها'. نجا ومن معه بفضل الله وحفظه للمؤمنين.",
        source: "قصص الأنبياء"
    }
];

let wirdData = JSON.parse(localStorage.getItem('user_wird')) || [
    { id: 1, text: "سبحان الله وبحمده", target: 100, current: 0 },
    { id: 2, text: "أستغفر الله وأتوب إليه", target: 100, current: 0 },
    { id: 3, text: "لا إله إلا الله وحده لا شريك له", target: 100, current: 0 },
    { id: 4, text: "اللهم صلِ وسلم على نبينا محمد", target: 100, current: 0 }
];

function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    document.getElementById(pageId + '-page').classList.add('active');

    const navItems = document.querySelectorAll('.nav-item');
    if (pageId === 'home') navItems[0].classList.add('active');
    if (pageId === 'stories') navItems[1].classList.add('active');
    if (pageId === 'radio') navItems[2].classList.add('active');
    if (pageId === 'sakina') navItems[3].classList.add('active');
    if (pageId === 'wird') navItems[4].classList.add('active');

    if (pageId === 'stories') renderStories('users'); // Default to users
    if (pageId === 'radio') renderStations();
    if (pageId === 'wird') renderWird();
    if (pageId === 'wird') renderWird();

    // Volume integrated into card, no need for sidebar toggle logic anymore

    showPageIntro(pageId); // Show Guide Toast
    window.scrollTo(0, 0);
}

function setVolume(val) {
    if (audioObj) {
        audioObj.volume = val;
    }
    const icon = document.getElementById('vol-icon');
    if (val == 0) {
        icon.setAttribute('data-lucide', 'volume-x');
    } else if (val < 0.5) {
        icon.setAttribute('data-lucide', 'volume-1');
    } else {
        icon.setAttribute('data-lucide', 'volume-2');
    }
    lucide.createIcons();
}

function saveStory() {
    const author = document.getElementById('story-author').value || "عابر سبيل";
    const content = document.getElementById('story-content').value;
    if (!content) return;
    stories.unshift({ author, content });
    localStorage.setItem('user_stories', JSON.stringify(stories));
    document.getElementById('story-content').value = "";

    setStoryMode('users');
    showStatus("شُكر الله سعيك، تم النشر");
}

function renderStories(mode) {
    const list = document.getElementById('stories-list');

    if (mode === 'history') {
        list.innerHTML = historicalStories.map(s => `
                    <div class="card">
                        <h3 style="margin-bottom: 0.5rem;">${s.title}</h3>
                        <p style="font-size: 1.2rem; margin-bottom: 1rem; color: #F8F0E3; line-height: 1.8;">${s.content}</p>
                        <div style="display: flex; align-items: center; gap: 0.5rem; opacity: 0.6; font-size: 0.9rem;">
                            <i data-lucide="book" style="width: 14px;"></i>
                            <span>${s.source}</span>
                        </div>
                    </div>
                `).join('');
    } else {
        // User Stories (Default)
        list.innerHTML = stories.map(s => `
                    <div class="card">
                        <p style="font-size: 1.2rem; margin-bottom: 1rem; color: #F8F0E3;">${s.content}</p>
                        <div style="display: flex; align-items: center; gap: 0.5rem; opacity: 0.6; font-size: 0.8rem;">
                            <i data-lucide="user" style="width: 12px;"></i>
                            <span>${s.author}</span>
                        </div>
                    </div>
                `).join('');
    }
    lucide.createIcons();
}

// --- Updated Wird Logic ---

function toggleWirdForm() {
    const form = document.getElementById('add-wird-form');
    if (form.style.display === 'none' || !form.style.display) {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}

function addWird() {
    const textInput = document.getElementById('new-wird-text');
    const targetInput = document.getElementById('new-wird-target');

    const text = textInput.value;
    const target = parseInt(targetInput.value);

    if (!text || !target) {
        showStatus("الرجاء تعبئة البيانات");
        return;
    }

    const newId = Date.now();
    wirdData.push({ id: newId, text: text, target: target, current: 0 });
    localStorage.setItem('user_wird', JSON.stringify(wirdData));

    textInput.value = "";
    toggleWirdForm();
    renderWird();
    showStatus("تمت إضافة الورد الجديد");
}

function deleteWird(id) {
    showConfirm("هل أنت متأكد من حذف هذا الورد؟", () => {
        wirdData = wirdData.filter(w => w.id !== id);
        localStorage.setItem('user_wird', JSON.stringify(wirdData));
        renderWird();
        showStatus("تم حذف الورد");
    });
}

function renderWird() {
    const container = document.getElementById('wird-container');
    let total = 0;
    let maxTotal = 0;

    if (wirdData.length === 0) {
        container.innerHTML = '<div style="text-align: center; opacity: 0.5;">لا يوجد أوراد حالياً. أضف وردك الخاص.</div>';
        document.getElementById('total-counts').innerText = 0;
        document.getElementById('progress-bar').style.width = '0%';
        return;
    }

    container.innerHTML = wirdData.map(item => {
        total += item.current;
        maxTotal += item.target;
        return `
                    <div class="wird-item">
                        <div style="flex: 1;">
                            <div style="font-size: 1.3rem;">${item.text}</div>
                            <div style="font-size: 0.8rem; opacity: 0.6;">المستهدف: ${item.target}</div>
                        </div>
                        <div class="counter-btn">
                            <button onclick="deleteWird(${item.id})" class="delete-btn" title="حذف">
                                <i data-lucide="trash-2" style="width: 18px;"></i>
                            </button>
                            <button onclick="decrementWird(${item.id})" class="control-btn btn-outline" style="min-width: 40px;">-</button>
                            <div class="count-display">${item.current}</div>
                            <button onclick="incrementWird(${item.id})" class="control-btn" style="min-width: 40px; background: var(--ivory-white); color: #000;">+</button>
                        </div>
                    </div>
                `;
    }).join('');

    lucide.createIcons();

    document.getElementById('total-counts').innerText = total;
    const progress = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
    document.getElementById('progress-bar').style.width = Math.min(progress, 100) + '%';
}

function incrementWird(id) {
    const item = wirdData.find(w => w.id === id);
    item.current++;
    localStorage.setItem('user_wird', JSON.stringify(wirdData));
    renderWird();
    if (item.current === item.target) showStatus(`أتممت ورد: ${item.text}`);
}

function decrementWird(id) {
    const item = wirdData.find(w => w.id === id);
    if (item.current > 0) {
        item.current--;
        localStorage.setItem('user_wird', JSON.stringify(wirdData));
        renderWird();
    }
}

function resetWird() {
    showConfirm("هل تريد تصفير جميع العدادات؟", () => {
        wirdData.forEach(w => w.current = 0);
        localStorage.setItem('user_wird', JSON.stringify(wirdData));
        renderWird();
        showStatus("تم تصفير العدادات");
    });
}

function showStatus(text) {
    const msg = document.getElementById('status-msg');
    msg.innerText = text;
    msg.style.display = 'block';
    setTimeout(() => msg.style.display = 'none', 3000);
}

// --- Realistic Ivory Aurora Engine ---
const canvas = document.getElementById('aurora-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let time = 0;
let mouse = { x: -1000, y: -1000 };

function initCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

// Function to draw aurora curtains
function drawAuroraCurtain(baseHeight, amplitude, frequency, speed, opacity, index) {
    ctx.beginPath();

    // Start from far left
    ctx.moveTo(0, height);

    // Draw top curve
    for (let x = 0; x <= width; x += 10) {
        // Intersecting waves for natural randomness
        let wave1 = Math.sin(x * frequency + time * speed + index);
        let wave2 = Math.sin(x * (frequency * 2.5) - time * (speed * 1.5));

        let combinedWave = (wave1 + wave2) * amplitude;

        // Mouse interaction
        const dist = Math.abs(x - mouse.x);
        const interaction = Math.max(0, (400 - dist) / 400);
        const mouseEffect = interaction * (height * 0.15);

        let y = height - baseHeight + combinedWave - mouseEffect;
        ctx.lineTo(x, y);
    }

    // Close shape downwards
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();

    // Vertical Gradient
    let gradientHeight = height - baseHeight + amplitude;
    const gradient = ctx.createLinearGradient(0, gradientHeight - 100, 0, height);

    // Color: #F8F0E3 (Ivory)
    gradient.addColorStop(0, `rgba(248, 240, 227, 0)`);
    gradient.addColorStop(0.3, `rgba(248, 240, 227, ${opacity})`);
    gradient.addColorStop(1, `rgba(248, 240, 227, 0.1)`);

    ctx.fillStyle = gradient;
    ctx.fill();
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    time += 0.008;

    ctx.globalCompositeOperation = "screen";

    drawAuroraCurtain(height * 0.5, 80, 0.002, 1, 0.15, 0);
    drawAuroraCurtain(height * 0.4, 60, 0.003, 1.5, 0.2, 2);
    drawAuroraCurtain(height * 0.3, 50, 0.005, 2, 0.25, 4);
    drawAuroraCurtain(height * 0.2, 40, 0.006, 2.5, 0.15, 6);

    ctx.globalCompositeOperation = "source-over";

    requestAnimationFrame(animate);
}

// --- Pulse Orb Carousel Logic ---
let orbIndex = 0;
const orbIntervalTime = 5000; // 5 seconds
let orbInterval;

function switchOrb(direction) {
    const orbs = document.querySelectorAll('.carousel-cell');
    if (!orbs.length) return;

    // Close current eye (fade out & shrink)
    orbs[orbIndex].classList.remove('active');

    // Calculate new index
    orbIndex += direction;
    if (orbIndex >= orbs.length) orbIndex = 0;
    if (orbIndex < 0) orbIndex = orbs.length - 1;

    // Open new eye (fade in & grow)
    // Small delay to allow closing animation to start
    setTimeout(() => {
        orbs[orbIndex].classList.add('active');
    }, 100);
}

// Auto Pulse
function startOrbAutoPlay() {
    clearInterval(orbInterval);
    orbInterval = setInterval(() => {
        switchOrb(1);
    }, orbIntervalTime);
}

// Restart autoplay on interaction
function resetOrbTimer() {
    startOrbAutoPlay();
}

// Bind clicks
document.querySelectorAll('.carousel-btn').forEach(btn => {
    btn.addEventListener('click', resetOrbTimer);
});

window.addEventListener('resize', () => {
    initCanvas();
    // Re-calc highlight pos on resize
    const activeTab = document.querySelector('.toggle-btn.active');
    if (activeTab) {
        // Determine mode based on ID
        let mode = 'users';
        if (activeTab.id === 'btn-mode-share') mode = 'share';
        if (activeTab.id === 'btn-mode-history') mode = 'history';
        setStoryMode(mode);
    }
});
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.onload = () => {
    initCanvas();
    animate();
    renderStories();
    startOrbAutoPlay();

    // 1. Check Tour FIRST (Priority Request)
    const tourSeen = localStorage.getItem('tourSeen');
    const hideIntro = localStorage.getItem('hideIntro');

    if (!tourSeen) {
        // If first visit ever, start tour immediately after specific delay
        setTimeout(() => {
            startTour();
            localStorage.setItem('tourSeen', 'true');
        }, 1500); // 1.5s delay to ensure UI is ready
    }

    // 2. Check Intro Video
    if (!hideIntro) {
        // Show video modal (it will be behind tour popover due to z-index)
        document.getElementById('intro-modal').style.display = 'flex';
    } else {
        document.getElementById('main-content').style.filter = 'blur(0)';

        // If returning user (tour seen) & no video needed -> show guide
        if (tourSeen) {
            showPageIntro('home');
        }
    }
};
