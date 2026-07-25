(function () {
  const screens = Array.from(document.querySelectorAll('.screen'));
  const pageMenu = document.getElementById('pageMenu');
  const progressLabel = document.getElementById('progressLabel');
  const progressPercent = document.getElementById('progressPercent');
  const progressBar = document.getElementById('progressBar');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const taskBtn = document.getElementById('taskBtn');
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
    prevBtn.disabled = current === 0;
    nextBtn.textContent = 'Далі';
    nextBtn.hidden = current === screens.length - 1;
    localStorage.setItem(storagePrefix + 'currentPage', String(current));
    updateMenuLocks();
    updatePreview();
    document.getElementById('lesson-main').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    ['communityName', 'Назва Вашої громади'],
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
    if (!preview) return;

    const today = new Date().toLocaleDateString('uk-UA');
    const artifactRows = worksheetLabels.filter(([key]) => key !== 'communityName');
    const rows = artifactRows.map(([key, label]) => {
      const value = escapeHtml(getValue(key) || '—').replace(/\n/g, '<br>');
      return `<div class="preview-row"><strong>${label}</strong><span>${value}</span></div>`;
    }).join('');

    preview.innerHTML = `<p><strong>Картка кліматичного виклику громади</strong></p><p>Дата: ${today}</p>${rows}`;
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
    const copyButtons = Array.from(document.querySelectorAll('[data-ai-scenario]'));
    const feedback = document.getElementById('aiPromptFeedback');
    if (!copyButtons.length || !feedback) return;

    const safetyInstruction = 'Не оцінюй картку як підтверджений факт. Відокремлюй припущення від інформації користувача. Не використовуй формулювання "ідеально", "правильно", "гарантовано". Не додавай непідтверджені факти.';

    function cardContext() {
      return worksheetLabels.map(([key, label]) => {
        const value = getValue(key).trim() || '[не заповнено]';
        return `${label}\n${value}`;
      }).join('\n\n');
    }

    function buildPrompt(scenario) {
      const card = cardContext();
      const prompts = {
        logic: `Ви — AI-помічник UCAN для міського голови та управлінської команди.\n\nЗавдання: перевірити логіку Картки кліматичного виклику громади. Не переписуйте завдання замість користувача. Перевірте, чи послідовно пов’язані: міський виклик → причина неефективності старої моделі → потрібні дані → залучені департаменти або партнери → smart-підхід → перший крок.\n\nКартка користувача:\n\n${card}\n\nДайте відповідь у чотирьох коротких блоках:\n1. Логічні зв’язки, які вже зрозумілі.\n2. Прогалини або суперечності, які варто уточнити.\n3. Припущення, які потрібно перевірити даними або розмовою з командою.\n4. Одне уточнювальне управлінське питання.\n\n${safetyInstruction}`,
        wording: `Ви — AI-помічник UCAN для міського голови та управлінської команди.\n\nЗавдання: допомогти уточнити формулювання Картки кліматичного виклику громади, зберігаючи зміст користувача. Не додавайте нових фактів, прикладів, цифр, причин або висновків. Не перетворюйте припущення на твердження.\n\nКартка користувача:\n\n${card}\n\nДля кожного заповненого поля:\n1. Коротко вкажіть, що може бути незрозумілим або надто загальним.\n2. Запропонуйте одне ясніше формулювання без зміни змісту.\n3. Позначте, яку інформацію ще має підтвердити користувач.\n\nНе заповнюйте порожні поля замість користувача.\n\n${safetyInstruction}`,
        'first-step': `Ви — AI-помічник UCAN для міського голови та управлінської команди.\n\nЗавдання: перевірити реалістичність першого кроку з Картки кліматичного виклику громади на період найближчих двох тижнів. Спирайтеся лише на інформацію користувача.\n\nКартка користувача:\n\n${card}\n\nПеревірте перший крок за п’ятьма критеріями:\n1. Чи має він конкретний результат.\n2. Чи зрозуміло, хто має почати дію.\n3. Чи доступні потрібні дані або їх можна швидко запросити.\n4. Чи залежить крок від непідтверджених рішень, ресурсів або партнерів.\n5. Чи реально розпочати або завершити його протягом двох тижнів.\n\nНаприкінці запропонуйте не більше двох обережних варіантів уточнення першого кроку, не додаючи нових фактів.\n\n${safetyInstruction}`
      };
      return prompts[scenario] || '';
    }

    copyButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const scenario = button.dataset.aiScenario;
        const prompt = buildPrompt(scenario);
        try {
          await copyToClipboard(prompt);
          feedback.className = 'feedback show success';
          feedback.textContent = 'Промпт скопійовано. Відкрийте обраний AI-сервіс і вставте його в чат.';
        } catch (error) {
          feedback.className = 'feedback show neutral';
          feedback.textContent = 'Не вдалося скопіювати автоматично. Спробуйте ще раз у захищеному браузерному вікні.';
        }
      });
    });
  }

  function setupImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('imageModalImage');
    const caption = document.getElementById('imageModalCaption');
    const closeBtn = document.getElementById('imageModalClose');
    if (!modal || !modalImage || !closeBtn) return;
    let trigger = null;

    function openModal(image) {
      trigger = image;
      modalImage.src = image.currentSrc || image.src;
      modalImage.alt = image.alt || '';
      if (caption) caption.textContent = image.alt || '';
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      closeBtn.focus();
    }

    function closeModal() {
      if (!modal.classList.contains('open')) return;
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      modalImage.removeAttribute('src');
      document.body.classList.remove('modal-open');
      if (trigger && document.contains(trigger)) trigger.focus();
      trigger = null;
    }

    document.querySelectorAll('.zoomable-image').forEach(image => {
      image.addEventListener('click', event => {
        event.preventDefault();
        openModal(image);
      });
      image.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openModal(image);
        }
      });
    });

    closeBtn.addEventListener('click', event => {
      event.stopPropagation();
      closeModal();
    });
    modalImage.addEventListener('click', event => event.stopPropagation());
    modal.addEventListener('click', closeModal);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  }

  function buildChallengeCardText() {
    const today = new Date().toLocaleDateString('uk-UA');
    const rows = worksheetLabels.map(([key, label]) => {
      const value = getValue(key).trim() || '—';
      return `${label}\n${value}`;
    }).join('\n\n');
    return `Картка кліматичного виклику громади\nДата: ${today}\n\n${rows}`;
  }

  async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    if (!copied) throw new Error('Copy command failed');
  }

  function setupFinalActions() {
    const copyBtn = document.getElementById('copyChallengeCard');
    const nextLessonBtn = document.getElementById('nextLessonBtn');
    const feedback = document.getElementById('finalActionFeedback');
    if (copyBtn && feedback) {
      copyBtn.addEventListener('click', async () => {
        try {
          await copyToClipboard(buildChallengeCardText());
          feedback.className = 'feedback show success';
          feedback.textContent = 'Картку скопійовано';
        } catch (error) {
          feedback.className = 'feedback show neutral';
          feedback.textContent = 'Не вдалося скопіювати картку автоматично. Спробуйте ще раз у захищеному браузерному вікні.';
        }
      });
    }
    if (nextLessonBtn && feedback) {
      nextLessonBtn.addEventListener('click', () => {
        const target = nextLessonBtn.dataset.nextLessonUrl.trim();
        if (target) {
          window.location.assign(target);
          return;
        }
        feedback.className = 'feedback show neutral';
        feedback.textContent = 'Посилання на наступне заняття ще не визначено.';
      });
    }
  }

  function formatLocalIsoDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function safeFilePart(value) {
    const cleaned = String(value || 'Громада')
      .trim()
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_')
      .slice(0, 80);
    return cleaned || 'Громада';
  }

  function wrapCanvasText(ctx, value, maxWidth) {
    const paragraphs = String(value || '—').replace(/\r/g, '').split('\n');
    const lines = [];
    paragraphs.forEach((paragraph, paragraphIndex) => {
      const words = paragraph.trim().split(/\s+/).filter(Boolean);
      if (!words.length) {
        lines.push('');
      } else {
        let line = '';
        words.forEach(word => {
          const candidate = line ? `${line} ${word}` : word;
          if (ctx.measureText(candidate).width <= maxWidth) {
            line = candidate;
            return;
          }
          if (line) lines.push(line);
          if (ctx.measureText(word).width <= maxWidth) {
            line = word;
            return;
          }
          let fragment = '';
          Array.from(word).forEach(character => {
            const next = fragment + character;
            if (ctx.measureText(next).width > maxWidth && fragment) {
              lines.push(fragment);
              fragment = character;
            } else {
              fragment = next;
            }
          });
          line = fragment;
        });
        if (line) lines.push(line);
      }
      if (paragraphIndex < paragraphs.length - 1) lines.push('');
    });
    return lines.length ? lines : ['—'];
  }

  function createArtifactCanvases() {
    const width = 1240;
    const height = 1754;
    const margin = 88;
    const contentWidth = width - margin * 2;
    const bottomLimit = height - 115;
    const pages = [];
    let canvas;
    let ctx;
    let y;

    function startPage(isFirst) {
      canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.textBaseline = 'top';

      ctx.fillStyle = '#123b63';
      ctx.font = '700 50px Arial, "Noto Sans", sans-serif';
      ctx.fillText('UCAN', margin, 62);
      ctx.fillStyle = '#3d8b61';
      ctx.fillRect(margin, 122, 145, 8);

      if (isFirst) {
        ctx.fillStyle = '#123b63';
        ctx.font = '700 42px Arial, "Noto Sans", sans-serif';
        const titleLines = wrapCanvasText(ctx, 'Картка кліматичного виклику громади', contentWidth);
        let titleY = 166;
        titleLines.forEach(line => {
          ctx.fillText(line, margin, titleY);
          titleY += 54;
        });
        y = titleY + 26;

        ctx.fillStyle = '#41566b';
        ctx.font = '400 25px Arial, "Noto Sans", sans-serif';
        ctx.fillText(`Дата: ${new Date().toLocaleDateString('uk-UA')}`, margin, y);
        y += 43;
        const community = getValue('communityName').trim() || '—';
        const communityLines = wrapCanvasText(ctx, `Громада: ${community}`, contentWidth);
        communityLines.forEach(line => {
          ctx.fillText(line, margin, y);
          y += 36;
        });
        y += 35;
      } else {
        ctx.fillStyle = '#123b63';
        ctx.font = '700 28px Arial, "Noto Sans", sans-serif';
        ctx.fillText('Картка кліматичного виклику громади', margin, 158);
        y = 222;
      }
      pages.push(canvas);
    }

    function ensureSpace(requiredHeight) {
      if (y + requiredHeight <= bottomLimit) return;
      startPage(false);
    }

    function drawField(label, value) {
      ctx.font = '700 25px Arial, "Noto Sans", sans-serif';
      const labelLines = wrapCanvasText(ctx, label, contentWidth);
      ctx.font = '400 25px Arial, "Noto Sans", sans-serif';
      const valueLines = wrapCanvasText(ctx, value || '—', contentWidth);
      const estimated = labelLines.length * 34 + valueLines.length * 35 + 54;
      ensureSpace(Math.min(estimated, bottomLimit - y));

      ctx.fillStyle = '#123b63';
      ctx.font = '700 25px Arial, "Noto Sans", sans-serif';
      labelLines.forEach(line => {
        ensureSpace(45);
        ctx.fillText(line, margin, y);
        y += 34;
      });
      y += 8;

      ctx.fillStyle = '#172b3a';
      ctx.font = '400 25px Arial, "Noto Sans", sans-serif';
      valueLines.forEach(line => {
        ensureSpace(45);
        ctx.fillText(line || ' ', margin, y);
        y += 35;
      });
      y += 20;
      ctx.fillStyle = '#d7e2ea';
      ctx.fillRect(margin, y, contentWidth, 2);
      y += 28;
    }

    startPage(true);
    worksheetLabels
      .filter(([key]) => key !== 'communityName')
      .forEach(([key, label]) => drawField(label, getValue(key).trim() || '—'));

    ensureSpace(90);
    ctx.fillStyle = '#e9f5ee';
    ctx.fillRect(margin, y, 390, 58);
    ctx.fillStyle = '#276b49';
    ctx.font = '700 24px Arial, "Noto Sans", sans-serif';
    ctx.fillText('Артефакт Портфеля мера', margin + 20, y + 15);

    return pages;
  }

  async function canvasToJpegBytes(canvas) {
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(result => result ? resolve(result) : reject(new Error('Canvas export failed')), 'image/jpeg', 0.94);
    });
    return new Uint8Array(await blob.arrayBuffer());
  }

  function buildImagePdf(images, pixelWidth, pixelHeight) {
    const encoder = new TextEncoder();
    const chunks = [];
    const offsets = [];
    let length = 0;

    function append(data) {
      const bytes = typeof data === 'string' ? encoder.encode(data) : data;
      chunks.push(bytes);
      length += bytes.length;
    }

    function beginObject(id) {
      offsets[id] = length;
      append(`${id} 0 obj\n`);
    }

    function endObject() {
      append('endobj\n');
    }

    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const objectCount = 2 + images.length * 3;
    append('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');

    beginObject(1);
    append('<< /Type /Catalog /Pages 2 0 R >>\n');
    endObject();

    const pageIds = images.map((_, index) => 3 + index * 3);
    beginObject(2);
    append(`<< /Type /Pages /Count ${images.length} /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] >>\n`);
    endObject();

    images.forEach((imageBytes, index) => {
      const pageId = 3 + index * 3;
      const contentId = pageId + 1;
      const imageId = pageId + 2;
      const content = `q\n${pageWidth} 0 0 ${pageHeight} 0 0 cm\n/Im0 Do\nQ\n`;

      beginObject(pageId);
      append(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>\n`);
      endObject();

      beginObject(contentId);
      append(`<< /Length ${encoder.encode(content).length} >>\nstream\n${content}endstream\n`);
      endObject();

      beginObject(imageId);
      append(`<< /Type /XObject /Subtype /Image /Width ${pixelWidth} /Height ${pixelHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n`);
      append(imageBytes);
      append('\nendstream\n');
      endObject();
    });

    const xrefOffset = length;
    append(`xref\n0 ${objectCount + 1}\n`);
    append('0000000000 65535 f \n');
    for (let id = 1; id <= objectCount; id += 1) {
      append(`${String(offsets[id]).padStart(10, '0')} 00000 n \n`);
    }
    append(`trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);
    return new Blob(chunks, { type: 'application/pdf' });
  }

  function setupPdfExport() {
    const pdfBtn = document.getElementById('printCard');
    const feedback = document.getElementById('pdfExportFeedback');
    if (!pdfBtn) return;

    pdfBtn.addEventListener('click', async () => {
      const originalText = pdfBtn.textContent;
      pdfBtn.disabled = true;
      pdfBtn.textContent = 'Створення PDF…';
      if (feedback) {
        feedback.className = 'feedback show neutral';
        feedback.textContent = 'Готуємо картку до завантаження.';
      }
      try {
        const canvases = createArtifactCanvases();
        const images = [];
        for (const canvas of canvases) images.push(await canvasToJpegBytes(canvas));
        const pdfBlob = buildImagePdf(images, canvases[0].width, canvases[0].height);
        const community = safeFilePart(getValue('communityName'));
        const fileName = `Картка_кліматичного_виклику_${community}_${formatLocalIsoDate(new Date())}.pdf`;
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1500);
        if (feedback) {
          feedback.className = 'feedback show success';
          feedback.textContent = 'PDF створено та завантажено.';
        }
      } catch (error) {
        if (feedback) {
          feedback.className = 'feedback show neutral';
          feedback.textContent = 'Не вдалося створити PDF у цьому браузері. Спробуйте оновити сторінку або відкрити її в сучасному браузері.';
        }
      } finally {
        pdfBtn.disabled = false;
        pdfBtn.textContent = originalText;
      }
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
  setupPdfExport();
  setupImageModal();
  setupFinalActions();
  if (interactiveIndex > -1 && current > interactiveIndex && !decisionCompleted()) current = interactiveIndex;
  if (current === reflectionIndex && !quizPassed()) current = knowledgeIndex;
  if (current === knowledgeIndex && highestPage < resourcesIndex) current = Math.min(highestPage, resourcesIndex);
  showScreen(current);
})();
