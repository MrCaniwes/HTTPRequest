// ============================================================
// API COCKPIT STUDIO - FRONTEND JAVASCRIPT CONTROLLER
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // Method Segments
  const methodSegments = document.querySelectorAll(".method-segment");
  let selectedMethod = "GET";

  // URL & Action Controls
  const urlInput = document.getElementById("urlInput");
  const protocolBadge = document.getElementById("protocolBadge");
  const btnClearUrl = document.getElementById("btnClearUrl");
  const btnSend = document.getElementById("btnSend");
  const laserTrack = document.getElementById("laserTrack");

  // Dock & Drawer
  const dockBtnComposer = document.getElementById("dockBtnComposer");
  const dockBtnHistory = document.getElementById("dockBtnHistory");
  const dockBtnPresets = document.getElementById("dockBtnPresets");
  const historyDrawer = document.getElementById("historyDrawer");
  const btnCloseHistory = document.getElementById("btnCloseHistory");
  const btnClearHistory = document.getElementById("btnClearHistory");
  const historyList = document.getElementById("historyList");
  const historyBadgeCount = document.getElementById("historyBadgeCount");
  const historyDrawerCount = document.getElementById("historyDrawerCount");

  // Tabs & Indicators
  const forgeTabs = document.querySelectorAll(".forge-tab-btn");
  const forgePanes = document.querySelectorAll(".forge-pane");
  const badgeAuth = document.getElementById("badgeAuth");
  const badgeBody = document.getElementById("badgeBody");
  const badgeHeaders = document.getElementById("badgeHeaders");

  // Auth Cards & Subforms
  const authCards = document.querySelectorAll(".auth-mode-card");
  const authSubforms = {
    none: document.getElementById("subformNone"),
    bearer: document.getElementById("subformBearer"),
    apikey: document.getElementById("subformApiKey"),
    basic: document.getElementById("subformBasic")
  };
  let selectedAuthMode = "none";
  const bearerTokenInput = document.getElementById("bearerTokenInput");
  const btnPasteBearer = document.getElementById("btnPasteBearer");
  const apiKeyName = document.getElementById("apiKeyName");
  const apiKeyValue = document.getElementById("apiKeyValue");
  const basicUser = document.getElementById("basicUser");
  const basicPass = document.getElementById("basicPass");

  // Body & Headers
  const bodyContentType = document.getElementById("bodyContentType");
  const requestBodyText = document.getElementById("requestBodyText");
  const requestHeadersText = document.getElementById("requestHeadersText");
  const btnSampleJson = document.getElementById("btnSampleJson");
  const btnFormatBodyJson = document.getElementById("btnFormatBodyJson");
  const btnClearBody = document.getElementById("btnClearBody");
  const btnAddAcceptJson = document.getElementById("btnAddAcceptJson");
  const btnClearHeaders = document.getElementById("btnClearHeaders");

  // HUD Response Elements
  const hudStatusCode = document.getElementById("hudStatusCode");
  const hudStatusDesc = document.getElementById("hudStatusDesc");
  const hudLatency = document.getElementById("hudLatency");
  const hudSize = document.getElementById("hudSize");
  const btnCopyResponse = document.getElementById("btnCopyResponse");
  const btnDownloadResponse = document.getElementById("btnDownloadResponse");
  const btnClearResponse = document.getElementById("btnClearResponse");
  const btnFormatResponseJson = document.getElementById("btnFormatResponseJson");

  // Inspector Tabs
  const inspTabs = document.querySelectorAll(".insp-tab");
  const inspViews = document.querySelectorAll(".insp-view");
  const responseBodyViewer = document.getElementById("responseBodyViewer");
  const responseLineNumbers = document.getElementById("responseLineNumbers");
  const responseHeadersViewer = document.getElementById("responseHeadersViewer");
  const responseRawViewer = document.getElementById("responseRawViewer");

  // Reset & Presets
  const btnResetAll = document.getElementById("btnResetAll");
  const presetPills = document.querySelectorAll(".preset-pill[data-preset]");

  // In-memory History
  let requestHistory = [];
  try {
    const saved = localStorage.getItem("cockpit_history");
    if (saved) requestHistory = JSON.parse(saved);
  } catch {}

  // 1. METHOD SEGMENT SELECTION
  methodSegments.forEach(seg => {
    seg.addEventListener("click", () => {
      methodSegments.forEach(s => s.classList.remove("active"));
      seg.classList.add("active");
      selectedMethod = seg.getAttribute("data-method");

      // Auto-suggest sample JSON if body is empty
      if ((selectedMethod === "POST" || selectedMethod === "PUT" || selectedMethod === "PATCH") && !requestBodyText.value.trim()) {
        requestBodyText.value = JSON.stringify({
          title: "Yeni İstek",
          body: "Cockpit test mesajı",
          timestamp: new Date().toISOString()
        }, null, 2);
        updateBadges();
      }
    });
  });

  // URL Protocol Badge Update
  urlInput.addEventListener("input", () => {
    const val = urlInput.value.trim().toLowerCase();
    if (val.startsWith("http://")) protocolBadge.textContent = "HTTP";
    else protocolBadge.textContent = "HTTPS";
  });

  btnClearUrl.addEventListener("click", () => {
    urlInput.value = "";
    urlInput.focus();
  });

  // 2. FORGE TABS
  forgeTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      forgeTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const targetId = tab.getAttribute("data-forgetab");
      forgePanes.forEach(p => p.classList.remove("active"));
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add("active");
    });
  });

  // 3. AUTH CARDS SELECTION
  authCards.forEach(card => {
    card.addEventListener("click", () => {
      authCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      selectedAuthMode = radio.value;

      Object.keys(authSubforms).forEach(key => {
        if (key === selectedAuthMode) authSubforms[key].classList.add("active");
        else authSubforms[key].classList.remove("active");
      });

      updateBadges();
    });
  });

  // Paste Bearer
  btnPasteBearer.addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        bearerTokenInput.value = text.trim();
        updateBadges();
      }
    } catch {
      bearerTokenInput.focus();
    }
  });

  // 4. BADGES UPDATER
  function updateBadges() {
    // Auth badge
    if (selectedAuthMode === "none") badgeAuth.textContent = "Yok";
    else if (selectedAuthMode === "bearer") badgeAuth.textContent = bearerTokenInput.value.trim() ? "Bearer ✓" : "Bearer";
    else if (selectedAuthMode === "apikey") badgeAuth.textContent = apiKeyValue.value.trim() ? "Key ✓" : "Key";
    else if (selectedAuthMode === "basic") badgeAuth.textContent = basicUser.value.trim() ? "Basic ✓" : "Basic";

    // Body badge
    const bodyLen = requestBodyText.value.trim().length;
    badgeBody.textContent = bodyLen > 0 ? "Dolu" : "Boş";

    // Headers badge
    const lines = requestHeadersText.value.split("\n").filter(l => l.trim().length > 0);
    badgeHeaders.textContent = lines.length.toString();
  }

  requestBodyText.addEventListener("input", updateBadges);
  requestHeadersText.addEventListener("input", updateBadges);
  bearerTokenInput.addEventListener("input", updateBadges);
  apiKeyValue.addEventListener("input", updateBadges);
  basicUser.addEventListener("input", updateBadges);

  // 5. INSPECTOR TABS
  inspTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      inspTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const targetId = tab.getAttribute("data-insptab");
      inspViews.forEach(v => v.classList.remove("active"));
      const targetView = document.getElementById(targetId);
      if (targetView) targetView.classList.add("active");
    });
  });

  // Scroll sync for line numbers
  if (responseBodyViewer && responseLineNumbers) {
    responseBodyViewer.addEventListener("scroll", () => {
      responseLineNumbers.scrollTop = responseBodyViewer.scrollTop;
    });
  }

  function updateLineNumbers(text) {
    if (!responseLineNumbers) return;
    const linesCount = Math.max(1, (text || "").split("\n").length);
    let out = "";
    for (let i = 1; i <= linesCount; i++) {
      out += i + "\n";
    }
    responseLineNumbers.textContent = out;
  }
  updateLineNumbers(responseBodyViewer?.textContent || "");

  // 6. SEND REQUEST (C# BRIDGE)
  function sendRequest() {
    let url = urlInput.value.trim();
    if (!url) {
      alert("Lütfen geçerli bir URL adresi girin!");
      urlInput.focus();
      return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
      urlInput.value = url;
    }

    // Laser & Send State
    laserTrack.classList.add("firing");
    btnSend.disabled = true;
    btnSend.querySelector(".blast-icon").textContent = "⏳";
    btnSend.querySelector(".blast-label").textContent = "ATEŞLENİYOR...";

    hudStatusCode.className = "hud-badge";
    hudStatusCode.textContent = "WAIT";
    hudStatusDesc.textContent = "İstek İşleniyor...";
    hudLatency.textContent = "...";
    hudSize.textContent = "...";

    const payload = {
      action: "send_request",
      method: selectedMethod,
      url: url,
      authType: selectedAuthMode,
      token: bearerTokenInput.value.trim(),
      apiKeyName: apiKeyName.value.trim(),
      apiKeyValue: apiKeyValue.value.trim(),
      basicUser: basicUser.value.trim(),
      basicPass: basicPass.value,
      contentType: bodyContentType.value,
      headers: requestHeadersText.value,
      body: requestBodyText.value
    };

    if (window.chrome && window.chrome.webview) {
      window.chrome.webview.postMessage(payload);
    } else {
      setTimeout(() => {
        handleErrorResponse({
          errorTitle: "Bağlantı Hatası",
          errorMessage: "WebView2 köprüsüne erişilemedi. Uygulama C# üzerinden başlatılmalıdır.",
          elapsedMs: 0
        });
      }, 500);
    }
  }

  btnSend.addEventListener("click", sendRequest);
  urlInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendRequest();
  });

  // 7. C# RESPONSE LISTENER
  if (window.chrome && window.chrome.webview) {
    window.chrome.webview.addEventListener("message", (event) => {
      const data = event.data;
      if (typeof data === "object") {
        if (data.action === "response_received") {
          handleSuccessResponse(data);
        } else if (data.action === "response_error") {
          handleErrorResponse(data);
        }
      }
    });
  }

  function handleSuccessResponse(res) {
    laserTrack.classList.remove("firing");
    btnSend.disabled = false;
    btnSend.querySelector(".blast-icon").textContent = "⚡";
    btnSend.querySelector(".blast-label").textContent = "ATEŞLE";

    const code = res.statusCode;
    hudStatusCode.textContent = code;
    hudStatusDesc.textContent = res.statusText || `${code} OK`;

    if (code >= 200 && code < 300) hudStatusCode.className = "hud-badge status-2xx";
    else if (code >= 300 && code < 400) hudStatusCode.className = "hud-badge status-3xx";
    else if (code >= 400 && code < 500) hudStatusCode.className = "hud-badge status-4xx";
    else hudStatusCode.className = "hud-badge status-5xx";

    hudLatency.textContent = `${res.elapsedMs} ms`;
    hudSize.textContent = res.formattedSize;

    renderHighlightedJson(res.body || "");
    responseHeadersViewer.textContent = res.headers || "Başlık yok.";
    responseRawViewer.textContent = `HTTP/1.1 ${res.statusText}\n${res.headers}\n\n${res.body}`;

    // Add to History
    addHistoryItem({
      method: selectedMethod,
      url: urlInput.value.trim(),
      status: code,
      time: res.elapsedMs,
      timestamp: new Date().toLocaleTimeString(),
      body: requestBodyText.value,
      headers: requestHeadersText.value,
      authMode: selectedAuthMode,
      token: bearerTokenInput.value.trim()
    });
  }

  function handleErrorResponse(err) {
    laserTrack.classList.remove("firing");
    btnSend.disabled = false;
    btnSend.querySelector(".blast-icon").textContent = "⚡";
    btnSend.querySelector(".blast-label").textContent = "ATEŞLE";

    hudStatusCode.className = "hud-badge status-err";
    hudStatusCode.textContent = "ERR";
    hudStatusDesc.textContent = err.errorTitle || "Hata";
    hudLatency.textContent = `${err.elapsedMs || 0} ms`;
    hudSize.textContent = "0 B";

    const report = `[BAĞLANTI HATASI]\n${err.errorTitle}: ${err.errorMessage}`;
    responseBodyViewer.textContent = report;
    updateLineNumbers(report);
    responseHeadersViewer.textContent = report;
    responseRawViewer.textContent = report;
  }

  // Syntax Highlighting
  function renderHighlightedJson(raw) {
    if (!raw) {
      responseBodyViewer.textContent = "(Boş Yanıt)";
      updateLineNumbers("(Boş Yanıt)");
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      const pretty = JSON.stringify(parsed, null, 2);
      responseBodyViewer.innerHTML = syntaxHighlightJson(pretty);
      updateLineNumbers(pretty);
    } catch {
      responseBodyViewer.textContent = raw;
      updateLineNumbers(raw);
    }
  }

  function syntaxHighlightJson(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) cls = 'json-key';
        else cls = 'json-string';
      } else if (/true|false/.test(match)) cls = 'json-boolean';
      else if (/null/.test(match)) cls = 'json-null';
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }

  // 8. HISTORY DRAWER MANAGEMENT
  function renderHistory() {
    historyBadgeCount.textContent = requestHistory.length;
    historyDrawerCount.textContent = `${requestHistory.length} kayıt`;

    if (requestHistory.length === 0) {
      historyList.innerHTML = `<div class="history-empty">Henüz kaydedilmiş istek yok.</div>`;
      return;
    }

    historyList.innerHTML = "";
    requestHistory.slice().reverse().forEach((item, idx) => {
      const el = document.createElement("div");
      el.className = "history-item";
      el.innerHTML = `
        <div class="history-item-top">
          <span class="hist-method ${item.method}">${item.method}</span>
          <span class="hist-status ${item.status >= 200 && item.status < 300 ? 'success' : 'error'}">${item.status}</span>
        </div>
        <div class="hist-url" title="${item.url}">${item.url}</div>
        <div class="hist-time">${item.timestamp} • ${item.time}ms</div>
      `;
      el.addEventListener("click", () => {
        restoreHistoryItem(item);
        historyDrawer.classList.remove("open");
      });
      historyList.appendChild(el);
    });
  }

  function addHistoryItem(item) {
    requestHistory.unshift(item);
    if (requestHistory.length > 50) requestHistory.pop();
    try {
      localStorage.setItem("cockpit_history", JSON.stringify(requestHistory));
    } catch {}
    renderHistory();
  }

  function restoreHistoryItem(item) {
    // Restore Method
    selectedMethod = item.method;
    methodSegments.forEach(s => {
      if (s.getAttribute("data-method") === item.method) s.classList.add("active");
      else s.classList.remove("active");
    });

    urlInput.value = item.url;
    requestBodyText.value = item.body || "";
    requestHeadersText.value = item.headers || "Accept: application/json";

    // Restore Auth
    if (item.authMode) {
      selectedAuthMode = item.authMode;
      authCards.forEach(c => {
        const rad = c.querySelector('input');
        if (rad && rad.value === item.authMode) c.classList.add("active");
        else c.classList.remove("active");
      });
      Object.keys(authSubforms).forEach(key => {
        if (key === item.authMode) authSubforms[key].classList.add("active");
        else authSubforms[key].classList.remove("active");
      });
      if (item.token) bearerTokenInput.value = item.token;
    }

    updateBadges();
  }

  dockBtnHistory.addEventListener("click", () => {
    historyDrawer.classList.toggle("open");
  });
  btnCloseHistory.addEventListener("click", () => {
    historyDrawer.classList.remove("open");
  });
  btnClearHistory.addEventListener("click", () => {
    requestHistory = [];
    try { localStorage.removeItem("cockpit_history"); } catch {}
    renderHistory();
  });
  renderHistory();

  // Dock composer shortcut
  dockBtnComposer.addEventListener("click", () => {
    historyDrawer.classList.remove("open");
    urlInput.focus();
  });

  // 9. PRESETS
  presetPills.forEach(pill => {
    pill.addEventListener("click", () => {
      const type = pill.getAttribute("data-preset");
      if (type === "posts-get") {
        setMethod("GET");
        urlInput.value = "https://jsonplaceholder.typicode.com/posts/1";
      } else if (type === "posts-post") {
        setMethod("POST");
        urlInput.value = "https://jsonplaceholder.typicode.com/posts";
        requestBodyText.value = JSON.stringify({
          title: "Cockpit POST",
          body: "Yepyeni bir test kaydı",
          userId: 101
        }, null, 2);
        document.querySelector('.forge-tab-btn[data-forgetab="tab-body"]')?.click();
      } else if (type === "users-get") {
        setMethod("GET");
        urlInput.value = "https://jsonplaceholder.typicode.com/users";
      }
      updateBadges();
    });
  });

  function setMethod(m) {
    selectedMethod = m;
    methodSegments.forEach(s => {
      if (s.getAttribute("data-method") === m) s.classList.add("active");
      else s.classList.remove("active");
    });
  }

  // 10. TOOLS & HELPERS
  btnResetAll.addEventListener("click", () => {
    setMethod("GET");
    urlInput.value = "https://jsonplaceholder.typicode.com/posts/1";
    requestBodyText.value = "";
    requestHeadersText.value = "Accept: application/json";
    bearerTokenInput.value = "";
    apiKeyValue.value = "";
    basicUser.value = "";
    basicPass.value = "";

    // Reset Auth to None
    authCards[0].click();
    updateBadges();

    hudStatusCode.className = "hud-badge";
    hudStatusCode.textContent = "IDLE";
    hudStatusDesc.textContent = "İstek Bekleniyor";
    hudLatency.textContent = "-- ms";
    hudSize.textContent = "-- KB";
    responseBodyViewer.textContent = "Sıfırlandı. Yeni bir istek gönderebilirsiniz.";
    updateLineNumbers("Sıfırlandı.");
    responseHeadersViewer.textContent = "";
    responseRawViewer.textContent = "";
  });

  btnSampleJson.addEventListener("click", () => {
    requestBodyText.value = JSON.stringify({
      product: "Cyber Deck Terminal",
      status: "active",
      power: 99.8,
      tags: ["cyber", "neon", "fast"]
    }, null, 2);
    updateBadges();
  });

  btnFormatBodyJson.addEventListener("click", () => {
    try {
      const parsed = JSON.parse(requestBodyText.value);
      requestBodyText.value = JSON.stringify(parsed, null, 2);
    } catch {
      alert("Gövdedeki veri geçerli bir JSON değil.");
    }
  });

  btnClearBody.addEventListener("click", () => {
    requestBodyText.value = "";
    updateBadges();
  });

  btnAddAcceptJson.addEventListener("click", () => {
    if (!requestHeadersText.value.includes("Accept: application/json")) {
      requestHeadersText.value = (requestHeadersText.value.trim() + "\nAccept: application/json").trim();
      updateBadges();
    }
  });

  btnClearHeaders.addEventListener("click", () => {
    requestHeadersText.value = "";
    updateBadges();
  });

  // Copy Response
  btnCopyResponse.addEventListener("click", async () => {
    const rawText = responseBodyViewer.innerText || responseBodyViewer.textContent;
    if (rawText) {
      try {
        await navigator.clipboard.writeText(rawText);
        const icon = btnCopyResponse.querySelector(".btn-icon");
        const text = btnCopyResponse.querySelector(".btn-text");
        icon.textContent = "✓";
        text.textContent = "Kopyalandı!";
        setTimeout(() => {
          icon.textContent = "📋";
          text.textContent = "Kopyala";
        }, 1600);
      } catch (err) {
        console.error(err);
      }
    }
  });

  // Download Response as File
  btnDownloadResponse.addEventListener("click", () => {
    const text = responseBodyViewer.innerText || responseBodyViewer.textContent;
    if (!text) return;
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `response_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  btnClearResponse.addEventListener("click", () => {
    responseBodyViewer.textContent = "";
    updateLineNumbers("");
    responseHeadersViewer.textContent = "";
    responseRawViewer.textContent = "";
    hudStatusCode.className = "hud-badge";
    hudStatusCode.textContent = "IDLE";
    hudStatusDesc.textContent = "Temizlendi";
    hudLatency.textContent = "-- ms";
    hudSize.textContent = "-- KB";
  });

  btnFormatResponseJson.addEventListener("click", () => {
    renderHighlightedJson(responseBodyViewer.innerText || responseBodyViewer.textContent);
  });
});
