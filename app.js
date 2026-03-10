(function () {
  "use strict";

  function getEl(id) {
    return document.getElementById(id);
  }

  function getConnectionParams() {
    const apiUrl = (getEl("apiUrl").value || "").trim().replace(/\/$/, "");
    const idInstance = (getEl("idInstance").value || "").trim();
    const apiTokenInstance = (getEl("apiTokenInstance").value || "").trim();
    return { apiUrl, idInstance, apiTokenInstance };
  }

  function setResponse(text) {
    const el = getEl("response");
    el.value = typeof text === "string" ? text : JSON.stringify(text, null, 2);
  }

  function setResponseError(status, body) {
    setResponse("HTTP " + status + "\n\n" + (typeof body === "string" ? body : JSON.stringify(body, null, 2)));
  }

  function validateConnection() {
    const { apiUrl, idInstance, apiTokenInstance } = getConnectionParams();
    if (!apiUrl) {
      setResponse("Error: apiUrl is required.");
      return null;
    }
    if (!idInstance) {
      setResponse("Error: idInstance is required.");
      return null;
    }
    if (!apiTokenInstance) {
      setResponse("Error: ApiTokenInstance is required.");
      return null;
    }
    return { apiUrl, idInstance, apiTokenInstance };
  }

  function buildUrl(apiUrl, idInstance, apiTokenInstance, path) {
    return apiUrl + "/waInstance" + idInstance + path + apiTokenInstance;
  }

  function setButtonsDisabled(disabled) {
    ["btnGetSettings", "btnGetStateInstance", "btnSendMessage", "btnSendFileByUrl"].forEach(function (id) {
      getEl(id).disabled = !!disabled;
    });
  }

  function handleResponse(response, responseEl) {
    return response.text().then(function (text) {
      try {
        const parsed = JSON.parse(text);
        responseEl(parsed);
      } catch (_) {
        responseEl(text);
      }
    });
  }

  function getSettings() {
    const params = validateConnection();
    if (!params) return;
    setButtonsDisabled(true);
    setResponse("Loading...");
    const url = buildUrl(params.apiUrl, params.idInstance, params.apiTokenInstance, "/getSettings/");
    fetch(url, { method: "GET" })
      .then(function (res) {
        if (res.ok) {
          return handleResponse(res, setResponse);
        }
        return res.text().then(function (body) {
          setResponseError(res.status, body);
        });
      })
      .catch(function (err) {
        setResponse("Request failed: " + err.message);
      })
      .finally(function () {
        setButtonsDisabled(false);
      });
  }

  function getStateInstance() {
    const params = validateConnection();
    if (!params) return;
    setButtonsDisabled(true);
    setResponse("Loading...");
    const url = buildUrl(params.apiUrl, params.idInstance, params.apiTokenInstance, "/getStateInstance/");
    fetch(url, { method: "GET" })
      .then(function (res) {
        if (res.ok) {
          return handleResponse(res, setResponse);
        }
        return res.text().then(function (body) {
          setResponseError(res.status, body);
        });
      })
      .catch(function (err) {
        setResponse("Request failed: " + err.message);
      })
      .finally(function () {
        setButtonsDisabled(false);
      });
  }

  function sendMessage() {
    const params = validateConnection();
    if (!params) return;
    const chatId = (getEl("chatId").value || "").trim();
    const message = (getEl("message").value || "").trim();
    if (!chatId) {
      setResponse("Error: chatId is required for sendMessage.");
      return;
    }
    if (!message) {
      setResponse("Error: message is required for sendMessage.");
      return;
    }
    setButtonsDisabled(true);
    setResponse("Sending...");
    const url = buildUrl(params.apiUrl, params.idInstance, params.apiTokenInstance, "/sendMessage/");
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId: chatId, message: message }),
    })
      .then(function (res) {
        return res.text().then(function (body) {
          if (res.ok) {
            try {
              setResponse(JSON.parse(body));
            } catch (_) {
              setResponse(body);
            }
          } else {
            setResponseError(res.status, body);
          }
        });
      })
      .catch(function (err) {
        setResponse("Request failed: " + err.message);
      })
      .finally(function () {
        setButtonsDisabled(false);
      });
  }

  function sendFileByUrl() {
    const params = validateConnection();
    if (!params) return;
    const chatId = (getEl("fileChatId").value || "").trim();
    const urlFile = (getEl("urlFile").value || "").trim();
    const fileName = (getEl("fileName").value || "").trim();
    const caption = (getEl("caption").value || "").trim();
    if (!chatId) {
      setResponse("Error: chatId is required for sendFileByUrl.");
      return;
    }
    if (!urlFile) {
      setResponse("Error: urlFile is required for sendFileByUrl.");
      return;
    }
    if (!fileName) {
      setResponse("Error: fileName is required for sendFileByUrl.");
      return;
    }
    setButtonsDisabled(true);
    setResponse("Sending...");
    const url = buildUrl(params.apiUrl, params.idInstance, params.apiTokenInstance, "/sendFileByUrl/");
    const body = { chatId: chatId, urlFile: urlFile, fileName: fileName };
    if (caption) body.caption = caption;
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(function (res) {
        return res.text().then(function (text) {
          if (res.ok) {
            try {
              setResponse(JSON.parse(text));
            } catch (_) {
              setResponse(text);
            }
          } else {
            setResponseError(res.status, text);
          }
        });
      })
      .catch(function (err) {
        setResponse("Request failed: " + err.message);
      })
      .finally(function () {
        setButtonsDisabled(false);
      });
  }

  getEl("btnGetSettings").addEventListener("click", getSettings);
  getEl("btnGetStateInstance").addEventListener("click", getStateInstance);
  getEl("btnSendMessage").addEventListener("click", sendMessage);
  getEl("btnSendFileByUrl").addEventListener("click", sendFileByUrl);
})();
