(function () {
  const screens = Array.from(document.querySelectorAll('.screen'));
  const pageMenu = document.getElementById('pageMenu');
  const progressLabel = document.getElementById('progressLabel');
  const progressPercent = document.getElementById('progressPercent');
  const progressBar = document.getElementById('progressBar');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const taskBtn = document.getElementById('taskBtn');
  const pageLabel = document.getElementById('page-label');
  const navPageCount = document.getElementById('nav-page-count');
  const globalStatus = document.getElementById('global-status');
  const progressTrack = document.getElementById('progressTrack');
  const storagePrefix = 'ucan_l01_page_rebuild_';
  const quizPassedKey = storagePrefix + 'quizPassed';
  const decisionCompletedKey = storagePrefix + 'decisionCompleted';
  const highestPageKey = storagePrefix + 'highestPage';
  let current = Number(localStorage.getItem(storagePrefix + 'currentPage') || 0);
  let highestPage = Number(localStorage.getItem(highestPageKey) || 0);

  const knowledgeIndex = screens.findIndex(screen => screen.id === 'page-12');
  const reflectionIndex = screens.findIndex(screen => screen.id === 'page-13');
  const resourcesIndex = screens.findIndex(screen => screen.id === 'page-9');
  const interactiveIndex = screens.findIndex(screen => screen.id === 'page-10');

  function quizPassed() {
    return localStorage.getItem(quizPassedKey) === 'true';
  }

  function decisionCompleted() {
    return localStorage.getItem(decisionCompletedKey) === 'true';
  }

  function safeIndex(index) {
    return Math.max(0, Math.min(index, screens.length - 1));
  }

  function showGateMessage(message) {
    const quizGate = document.getElementById('quizGateMessage');
    const quizFeedback = document.getElementById('quizFeedback');
    const decisionFeedback = document.getElementById('decisionFeedback');
    const target = current === interactiveIndex && decisionFeedback
      ? decisionFeedback
      : current === knowledgeIndex && quizGate
        ? quizGate
        : quizFeedback || quizGate || decisionFeedback;
    if (target) {
      target.className = 'feedback show neutral';
      target.textContent = message;
    } else {
      window.alert(message);
    }
  }

  function gateMessageForIndex(index) {
    if (interactiveIndex > -1 && index > interactiveIndex && !decisionCompleted()) {
      return 'Спочатку завершіть інтерактивне завдання. Оберіть правильну відповідь та натисніть «Перевірити».';
    }
    if (index === reflectionIndex && !quizPassed()) {
      return 'Щоб перейти далі, спочатку пройдіть підсумковий тест.';
    }
    return 'Спочатку перегляньте попередні сторінки заняття.';
  }

  function canOpenPage(index) {
    if (index <= current) return true;
    if (interactiveIndex > -1 && index > interactiveIndex && !decisionCompleted()) return false;
    if (index === knowledgeIndex && highestPage < resourcesIndex) return false;
    if (index === reflectionIndex && !quizPassed()) return false;
    return true;
  }

  function updateMenuLocks() {
    const buttons = Array.from(pageMenu.querySelectorAll('button'));
    buttons.forEach((button, i) => {
      const lockedDecision = interactiveIndex > -1 && i > interactiveIndex && !decisionCompleted();
      const lockedKnowledge = i === knowledgeIndex && highestPage < resourcesIndex;
      const lockedReflection = i === reflectionIndex && !quizPassed();
      const locked = lockedDecision || lockedKnowledge || lockedReflection;
      button.disabled = locked;
      button.classList.toggle('locked', locked);
      if (locked) {
        const reason = lockedDecision
          ? 'Спочатку завершіть інтерактивне завдання. Оберіть правильну відповідь та натисніть «Перевірити».'
          : lockedKnowledge
            ? 'Спочатку перегляньте попередні сторінки заняття.'
            : 'Щоб перейти далі, спочатку пройдіть підсумковий тест.';
        button.setAttribute('aria-disabled', 'true');
        button.setAttribute('title', reason);
      } else {
        button.removeAttribute('aria-disabled');
        button.removeAttribute('title');
      }
    });
  }

  function buildMenu() {
    screens.forEach((screen, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = `${index + 1}. ${screen.dataset.title}`;
      btn.addEventListener('click', () => {
        if (!canOpenPage(index)) {
          showGateMessage(gateMessageForIndex(index));
          return;
        }
        showScreen(index);
      });
      pageMenu.appendChild(btn);
    });
  }

  function showScreen(index) {
    const requested = safeIndex(index);
    if (requested > current && !canOpenPage(requested)) {
      showGateMessage(gateMessageForIndex(requested));
      return;
    }

    current = requested;
    highestPage = Math.max(highestPage, current);
    localStorage.setItem(highestPageKey, String(highestPage));

    screens.forEach((screen, i) => screen.classList.toggle('active', i === current));
    const buttons = Array.from(pageMenu.querySelectorAll('button'));
    buttons.forEach((button, i) => {
      button.classList.toggle('active', i === current);
      if (i === current) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    const percent = Math.round(((current + 1) / screens.length) * 100);
    progressLabel.textContent = `Сторінка ${current + 1} з ${screens.length}`;
    progressPercent.textContent = `${percent}%`;
    progressBar.style.width = `${percent}%`;
    if (progressTrack) progressTrack.setAttribute('aria-valuenow', String(percent));
    if (pageLabel) pageLabel.textContent = screens[current].dataset.title || '';
    if (navPageCount) navPageCount.textContent = `${current + 1} / ${screens.length}`;
    prevBtn.disabled = current === 0;
    nextBtn.textContent = current === screens.length - 1 ? 'Заняття завершено' : 'Наступний розділ ➡️';
    localStorage.setItem(storagePrefix + 'currentPage', String(current));
    updateMenuLocks();
    updatePreview();
    document.getElementById('lesson-main').focus({ preventScroll: true });
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  function storeFormValues() {
    document.querySelectorAll('[data-store]').forEach(field => {
      const key = storagePrefix + field.dataset.store;
      const saved = localStorage.getItem(key);
      if (saved !== null) field.value = saved;
      field.addEventListener('input', () => {
        localStorage.setItem(key, field.value);
        updatePreview();
      });
    });
  }

  const worksheetLabels = [
    ['challenge', 'Який міський виклик Ви обрали?'],
    ['oldModel', 'Чому стара модель управління тут більше не працює?'],
    ['dataNeeded', 'Які дані потрібні для кращого рішення?'],
    ['partners', 'Які департаменти або партнери мають бути залучені?'],
    ['smartApproach', 'Який smart-підхід можна перевірити першим?'],
    ['firstStep', 'Який перший крок можна зробити протягом найближчих 2 тижнів?']
  ];

  function getValue(key) {
    return localStorage.getItem(storagePrefix + key) || '';
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
  }

  function updatePreview() {
    const preview = document.getElementById('cardPreview');
    const printAnswers = document.getElementById('printAnswers');
    const printDate = document.getElementById('printDate');
    if (!printAnswers || !printDate) return;

    const today = new Date().toLocaleDateString('uk-UA');
    printDate.textContent = today;
    const rows = worksheetLabels.map(([key, label]) => {
      const value = escapeHtml(getValue(key) || '—').replace(/\n/g, '<br>');
      return `<div class="preview-row"><strong>${label}</strong><span>${value}</span></div>`;
    }).join('');

    if (preview) {
      preview.innerHTML = `<p><strong>Картка кліматичного виклику громади</strong></p><p>Дата: ${today}</p>${rows}`;
    }
    printAnswers.innerHTML = worksheetLabels.map(([key, label]) => {
      const value = escapeHtml(getValue(key) || '—').replace(/\n/g, '<br>');
      return `<div class="print-answer"><strong>${label}</strong><span>${value}</span></div>`;
    }).join('');
  }

  function setupDecision() {
    const checkBtn = document.getElementById('checkDecision');
    const feedback = document.getElementById('decisionFeedback');
    if (!checkBtn || !feedback) return;
    checkBtn.addEventListener('click', () => {
      const selected = document.querySelector('input[name="decision"]:checked');
      if (!selected) {
        feedback.className = 'feedback show neutral';
        feedback.textContent = 'Оберіть один варіант, щоб побачити feedback.';
        return;
      }
      if (selected.value === 'B') {
        localStorage.setItem(decisionCompletedKey, 'true');
        feedback.className = 'feedback show success';
        feedback.innerHTML = '<strong>Правильна управлінська логіка.</strong> Найкращий вибір — B. Він не відмовляється від швидкої дії, але додає те, чого бракує старій моделі: дані, просторовий аналіз, координацію і попередження повторення проблеми.';
        updateMenuLocks();
      } else {
        const messages = {
          A: 'Швидко реагує, але не дає відповіді, чи проблема повториться. Спробуйте знайти варіант, який додає дані й координацію.',
          C: 'Може виглядати сучасно, але ризикує стати дорогим рішенням без управлінської логіки. Спочатку потрібно зрозуміти, які дані потрібні.',
          D: 'Стратегія важлива, але ризик для людей потребує першого керованого кроку вже зараз.'
        };
        feedback.className = 'feedback show neutral';
        feedback.textContent = messages[selected.value];
      }
    });
  }

  function setupQuiz() {
    const answers = { q1: 'B', q2: 'B', q3: 'C', q4: 'C', q5: 'C' };
    const checkBtn = document.getElementById('checkQuiz');
    const feedback = document.getElementById('quizFeedback');
    const gateMessage = document.getElementById('quizGateMessage');
    const answerKey = document.getElementById('answerKey');
    if (!checkBtn || !feedback) return;

    if (quizPassed()) {
      feedback.className = 'feedback show success';
      feedback.textContent = 'Підсумковий тест уже пройдено. Ви можете перейти далі.';
    }

    checkBtn.addEventListener('click', () => {
      if (gateMessage) {
        gateMessage.className = 'feedback neutral';
        gateMessage.textContent = '';
      }
      const missing = Object.keys(answers).filter(q => !document.querySelector(`input[name="${q}"]:checked`));
      if (missing.length) {
        localStorage.setItem(quizPassedKey, 'false');
        feedback.className = 'feedback show neutral';
        feedback.textContent = 'Дайте відповідь на всі питання, а потім натисніть “Перевірити тест”.';
        updateMenuLocks();
        return;
      }
      let correct = 0;
      Object.entries(answers).forEach(([q, val]) => {
        const chosen = document.querySelector(`input[name="${q}"]:checked`).value;
        if (chosen === val) correct += 1;
      });
      if (correct === Object.keys(answers).length) {
        localStorage.setItem(quizPassedKey, 'true');
        feedback.className = 'feedback show success';
        feedback.textContent = 'Усі відповіді правильні. Ви можете перейти далі.';
      } else {
        localStorage.setItem(quizPassedKey, 'false');
        feedback.className = 'feedback show neutral';
        feedback.textContent = `Правильних відповідей: ${correct} з 5. Перегляньте пояснення і спробуйте ще раз.`;
      }
      if (answerKey) answerKey.open = true;
      updateMenuLocks();
    });
  }

  function setupAIAssistant() {
    const copyBtn = document.getElementById('copyAIPrompt');
    const preview = document.getElementById('l01-ai-prompt-preview');
    const feedback = document.getElementById('aiPromptFeedback');
    const modes = Array.from(document.querySelectorAll('input[name="l01-ai-mode"]'));
    if (!copyBtn || !preview || !feedback || !modes.length) return;

    const instructions = {
      facts: 'Перевір факти й припущення. Відділи твердження, що випливають із моєї картки, від припущень. Назви прогалини, які потребують даних або перевірки. Не вигадуй місцевих фактів.',
      questions: 'Постав до трьох коротких уточнювальних запитань, які допоможуть мені самостійно покращити картку. Не давай готової відповіді замість мене.',
      structure: 'Перевір повноту та слабкі місця рішення. Знайди пропущені ризики, відсутні зв’язки та логічні прогалини. Не переписуй і не скорочуй текст.'
    };

    function buildPrompt() {
      const mode = modes.find(input => input.checked)?.value || 'facts';
      const answers = worksheetLabels.map(([key, label]) => {
        const value = getValue(key).trim() || '[не заповнено]';
        return `${label}\n${value}`;
      }).join('\n\n');
      return `Ви допомагаєте перевірити Картку кліматичного виклику громади в курсі UCAN.\n\n${instructions[mode]}\n\nПрацюйте лише з наведеними нижче відповідями. Не ухвалюйте рішення замість мене. Перевіряйте зв’язок зі Smart City як управлінською логікою: проблема → дані → команда → рішення → перший крок.\n\nМоя картка:\n\n${answers}`;
    }
    function renderPrompt() { preview.textContent = buildPrompt(); }
    modes.forEach(input => input.addEventListener('change', () => { renderPrompt(); feedback.textContent = 'Режим змінено. Запит оновлено.'; input.focus(); }));
    document.querySelectorAll('#page-11 textarea, #page-11 input[type="text"]').forEach(el => el.addEventListener('input', renderPrompt));
    copyBtn.addEventListener('click', async () => {
      renderPrompt();
      try {
        await window.UCANInterface.copyText(preview.textContent);
        feedback.className = 'feedback show success';
        feedback.textContent = 'Запит скопійовано. Відкрийте обраний сервіс і вставте його лише за власним рішенням.';
      } catch (error) {
        feedback.className = 'feedback show neutral';
        feedback.textContent = 'Не вдалося скопіювати автоматично. Виділіть текст у попередньому перегляді та скопіюйте вручну.';
      }
      copyBtn.focus();
    });
    renderPrompt();
  }

  function setupPrint() {
    const printBtn = document.getElementById('printCard');
    const status = document.getElementById('portfolioStatus') || globalStatus;
    if (!printBtn) return;
    printBtn.addEventListener('click', async () => {
      updatePreview();
      const data = Object.fromEntries(worksheetLabels.map(([key]) => [key, getValue(key)]));
      const community = window.UCANInterface.sanitizeFilename(data.challenge).slice(0, 40);
      await window.UCANInterface.downloadPortfolioPdf({
        button: printBtn,
        status,
        title: 'Картка кліматичного виклику громади',
        label: 'Портфель мера',
        filename: community ? `UCAN_Картка_кліматичного_виклику_${community}.pdf` : 'UCAN_Картка_кліматичного_виклику.pdf',
        fields: worksheetLabels.map(([key, label]) => ({ key, label })),
        data,
        note: 'Чернетка створена учасником. Перевірте дані та припущення разом із відповідальними підрозділами громади.'
      });
    });
  }


  function setupReset() {
    const reset = document.getElementById('reset-progress-top');
    if (!reset) return;
    reset.addEventListener('click', () => {
      const confirmed = window.confirm('Скинути прогрес, інтерактивне завдання та підсумковий тест? Дані практичної картки залишаться збереженими.');
      if (!confirmed) return;
      localStorage.removeItem(storagePrefix + 'currentPage');
      localStorage.removeItem(highestPageKey);
      localStorage.removeItem(quizPassedKey);
      localStorage.removeItem(decisionCompletedKey);
      highestPage = 0;
      document.querySelectorAll('input[type="radio"]').forEach(input => { input.checked = false; });
      document.querySelectorAll('.feedback').forEach(el => { el.textContent = ''; el.className = 'feedback'; });
      if (globalStatus) globalStatus.textContent = 'Навчальний прогрес скинуто. Практична картка збережена.';
      showScreen(0);
    });
  }

  prevBtn.addEventListener('click', () => showScreen(current - 1));
  nextBtn.addEventListener('click', () => {
    if (current === screens.length - 1) return;
    if (current === interactiveIndex && !decisionCompleted()) {
      showGateMessage('Спочатку завершіть інтерактивне завдання. Оберіть правильну відповідь та натисніть «Перевірити».');
      return;
    }
    if (current === knowledgeIndex && !quizPassed()) {
      showGateMessage('Щоб перейти далі, спочатку пройдіть підсумковий тест.');
      return;
    }
    showScreen(current + 1);
  });
  if (taskBtn) taskBtn.addEventListener('click', () => showScreen(10));
  document.querySelectorAll('[data-goto]').forEach(btn => btn.addEventListener('click', () => showScreen(Number(btn.dataset.goto) - 1)));

  buildMenu();
  storeFormValues();
  setupDecision();
  setupQuiz();
  setupAIAssistant();
  setupPrint();
  setupReset();
  if (interactiveIndex > -1 && current > interactiveIndex && !decisionCompleted()) current = interactiveIndex;
  if (current === reflectionIndex && !quizPassed()) current = knowledgeIndex;
  if (current === knowledgeIndex && highestPage < resourcesIndex) current = Math.min(highestPage, resourcesIndex);
  showScreen(current);
})();
