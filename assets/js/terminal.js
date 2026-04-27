(function () {
    const terminalBody = document.getElementById('terminal');
    const output = document.getElementById('interactive-output');
    const promptEl = document.getElementById('interactive-prompt');
    const hiddenInput = document.getElementById('terminal-input');
    const typed = document.getElementById('typed-text');

    let history = [];
    let histIdx = -1;

    // Click anywhere in the terminal to focus input
    terminalBody.addEventListener('click', () => hiddenInput.focus());

    // Mirror typed characters to the visible span
    hiddenInput.addEventListener('input', () => {
        typed.textContent = hiddenInput.value;
    });

    hiddenInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const cmd = hiddenInput.value.trim();
            submit(cmd);
            hiddenInput.value = '';
            typed.textContent = '';
            histIdx = -1;
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (histIdx < history.length - 1) {
                histIdx++;
                hiddenInput.value = history[history.length - 1 - histIdx];
                typed.textContent = hiddenInput.value;
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (histIdx > 0) {
                histIdx--;
                hiddenInput.value = history[history.length - 1 - histIdx];
                typed.textContent = hiddenInput.value;
            } else {
                histIdx = -1;
                hiddenInput.value = '';
                typed.textContent = '';
            }
        }
    });

    function submit(cmd) {
        if (cmd) history.push(cmd);
        appendPrompt(cmd);
        if (!cmd) { scrollDown(); return; }
        const result = run(cmd.toLowerCase());
        if (result) output.appendChild(result);
        appendSpacer();
        scrollDown();
    }

    function appendPrompt(cmd) {
        const d = document.createElement('div');
        d.className = 'prompt-line';
        d.style.marginTop = '8px';
        d.innerHTML =
            `<span class="prompt-user">joan</span>` +
            `<span class="prompt-at">@</span>` +
            `<span class="prompt-host">dev</span>` +
            `<span class="prompt-colon">:</span>` +
            `<span class="prompt-path">~</span>` +
            `<span class="prompt-dollar">$</span>` +
            `<span class="cmd"> ${esc(cmd)}</span>`;
        output.appendChild(d);
    }

    function appendSpacer() {
        const d = document.createElement('div');
        d.className = 'line';
        d.innerHTML = '&nbsp;';
        output.appendChild(d);
    }

    function scrollDown() {
        promptEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function esc(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function div(html) {
        const d = document.createElement('div');
        d.innerHTML = html;
        return d;
    }

    function run(cmd) {
        const map = { help: cmdHelp, extras: cmdExtras, whoami: cmdWhoami, learning: cmdLearning, clear: cmdClear };
        if (map[cmd]) return map[cmd]();
        return div(
            `<div class="line">bash: <span class="key">${esc(cmd)}</span>: comando no encontrado` +
            ` &mdash; prueba <span class="ok">help</span></div>`
        );
    }

    function cmdHelp() {
        return div(`
            <div class="line"><span class="md-h2">## Comandos disponibles</span></div>
            <div class="line">&nbsp;</div>
            <div class="line">  <span class="ok">help</span>      &mdash; muestra esta ayuda</div>
            <div class="line">  <span class="ok">extras</span>    &mdash; proyectos adicionales</div>
            <div class="line">  <span class="ok">whoami</span>    &mdash; información personal</div>
            <div class="line">  <span class="ok">learning</span>  &mdash; qué estoy aprendiendo ahora</div>
            <div class="line">  <span class="ok">clear</span>     &mdash; limpia el historial interactivo</div>
        `);
    }

    function cmdLearning() {
        return document.querySelector('#section-learning .output-block').cloneNode(true);
    }

    function cmdExtras() {
        return document.querySelector('#conten-extra .output-block').cloneNode(true);
    }

    function cmdWhoami() {
        return document.querySelector('#section-whoami .output-block').cloneNode(true);
    }

    function cmdClear() {
        output.innerHTML = '';
        return null;
    }

    // Auto-focus on load
    hiddenInput.focus();
})();
