
const Contact = {
  elements: {},
  isSearchingCep: false,

  init() {
    this.cacheElements();
    if (!this.elements.form) return;

    this.bindEvents();
    this.logIntegrationStatus();
  },

  cacheElements() {
    this.elements = {
      form: document.getElementById("contactForm"),
      inputNome: document.getElementById("contatoNome"),
      inputSobrenome: document.getElementById("contatoSobrenome"),
      inputEmail: document.getElementById("contatoEmail"),
      inputTelefone: document.getElementById("contatoTelefone"),
      inputCep: document.getElementById("contatoCep"),
      inputRua: document.getElementById("contatoRua"),
      inputNumero: document.getElementById("contatoNumero"),
      inputComplemento: document.getElementById("contatoComplemento"),
      inputBairro: document.getElementById("contatoBairro"),
      inputCidade: document.getElementById("contatoCidade"),
      inputUf: document.getElementById("contatoUf"),
      inputMensagem: document.getElementById("contatoMensagem"),
      cepSpinner: document.getElementById("cepSpinner"),
      cepStatus: document.getElementById("cepStatus"),
      submitBtn: document.getElementById("btnSubmitContact"),
      statusBox: document.getElementById("contactStatusBox")
    };
  },

  bindEvents() {
    const { inputCep, inputTelefone, form } = this.elements;

    if (inputCep) {
      inputCep.addEventListener("input", (e) => this.handleCepInput(e));
      inputCep.addEventListener("blur", () => this.handleCepBlur());
    }

    if (inputTelefone) {
      inputTelefone.addEventListener("input", (e) => this.handlePhoneInput(e));
    }

    if (form) {
      form.addEventListener("submit", (e) => this.handleSubmit(e));
    }
  },

  handleCepInput(e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);

    if (value.length > 5) {
      e.target.value = value.replace(/^(\d{5})(\d)/, "$1-$2");
    } else {
      e.target.value = value;
    }

    this.clearFieldError("cep");

    if (value.length === 8) {
      this.fetchAddressByCep(value);
    } else {
      this.setCepStatus("Digite os 8 dígitos do CEP", "normal");
    }
  },

  handleCepBlur() {
    const raw = this.elements.inputCep.value.replace(/\D/g, "");
    if (raw.length === 8 && !this.isSearchingCep) {
      this.fetchAddressByCep(raw);
    }
  },

  handlePhoneInput(e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 10) {
      e.target.value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    } else if (value.length > 6) {
      e.target.value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
    } else if (value.length > 2) {
      e.target.value = value.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
    } else {
      e.target.value = value;
    }
  },

  async fetchAddressByCep(cleanCep) {
    if (this.isSearchingCep) return;
    this.isSearchingCep = true;

    this.showCepLoading(true);
    this.setCepStatus("Localizando endereço...", "loading");

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
        cache: "force-cache"
      });

      if (!response.ok) throw new Error("Erro na rede ao consultar CEP");

      const data = await response.json();

      if (data.erro) {
        this.setCepStatus("CEP não encontrado. Preencha manualmente.", "error");
        this.showFieldError("cep", "CEP inválido ou inexistente");
        return;
      }

      if (this.elements.inputRua) {
        this.elements.inputRua.value = data.logradouro || "";
        this.clearFieldError("rua");
      }
      if (this.elements.inputBairro) {
        this.elements.inputBairro.value = data.bairro || "";
        this.clearFieldError("bairro");
      }
      if (this.elements.inputCidade) {
        this.elements.inputCidade.value = data.localidade || "";
        this.clearFieldError("cidade");
      }
      if (this.elements.inputUf) {
        this.elements.inputUf.value = data.uf || "";
        this.clearFieldError("uf");
      }

      if (this.elements.inputNumero) {
        this.elements.inputNumero.value = "";
        this.elements.inputNumero.classList.add("highlight-pulse");
        setTimeout(() => this.elements.inputNumero.classList.remove("highlight-pulse"), 1800);
        
        this.elements.inputNumero.focus();
      }

      this.setCepStatus(`${data.localidade || ""} - ${data.uf || ""}`, "success");
    } catch (err) {
      console.warn("[Contact] Falha ao consultar ViaCEP:", err);
      this.setCepStatus("Não foi possível buscar automaticamente. Digite o endereço.", "warning");
    } finally {
      this.showCepLoading(false);
      this.isSearchingCep = false;
    }
  },

  showCepLoading(isLoading) {
    if (this.elements.cepSpinner) {
      this.elements.cepSpinner.style.display = isLoading ? "inline-block" : "none";
    }
    if (this.elements.inputCep) {
      if (isLoading) {
        this.elements.inputCep.classList.add("is-loading");
      } else {
        this.elements.inputCep.classList.remove("is-loading");
      }
    }
  },

  setCepStatus(message, type = "normal") {
    if (!this.elements.cepStatus) return;
    this.elements.cepStatus.textContent = message;
    this.elements.cepStatus.className = `field-hint hint-${type}`;
  },

  showFieldError(fieldKey, message) {
    const errorEl = document.getElementById(`err-${fieldKey}`);
    const inputEl = this.elements[`input${fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1)}`];

    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = "block";
    }
    if (inputEl) {
      inputEl.classList.add("is-invalid");
    }
  },

  clearFieldError(fieldKey) {
    const errorEl = document.getElementById(`err-${fieldKey}`);
    const inputEl = this.elements[`input${fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1)}`];

    if (errorEl) {
      errorEl.textContent = "";
      errorEl.style.display = "none";
    }
    if (inputEl) {
      inputEl.classList.remove("is-invalid");
    }
  },

  clearAllErrors() {
    ["nome", "sobrenome", "email", "cep", "rua", "numero", "bairro", "cidade", "uf"].forEach(
      (key) => this.clearFieldError(key)
    );
  },

  validateForm() {
    this.clearAllErrors();
    let isValid = true;

    const fields = [
      { key: "nome", el: this.elements.inputNome, msg: "Por favor, informe seu nome" },
      { key: "sobrenome", el: this.elements.inputSobrenome, msg: "Por favor, informe seu sobrenome" },
      { key: "email", el: this.elements.inputEmail, msg: "Por favor, informe seu e-mail" },
      { key: "cep", el: this.elements.inputCep, msg: "Informe um CEP válido" },
      { key: "rua", el: this.elements.inputRua, msg: "Informe o logradouro / rua" },
      { key: "numero", el: this.elements.inputNumero, msg: "Digite o número da residência" },
      { key: "bairro", el: this.elements.inputBairro, msg: "Informe o bairro" },
      { key: "cidade", el: this.elements.inputCidade, msg: "Informe a cidade" },
      { key: "uf", el: this.elements.inputUf, msg: "UF" }
    ];

    fields.forEach(({ key, el, msg }) => {
      if (!el || !el.value.trim()) {
        this.showFieldError(key, msg);
        isValid = false;
      }
    });

    if (this.elements.inputEmail && this.elements.inputEmail.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.elements.inputEmail.value.trim())) {
        this.showFieldError("email", "Formato de e-mail inválido");
        isValid = false;
      }
    }

    if (this.elements.inputCep && this.elements.inputCep.value.trim()) {
      const cleanCep = this.elements.inputCep.value.replace(/\D/g, "");
      if (cleanCep.length !== 8) {
        this.showFieldError("cep", "O CEP deve conter 8 dígitos");
        isValid = false;
      }
    }

    return isValid;
  },

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      
      const firstInvalid = this.elements.form.querySelector(".is-invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    this.setSubmittingState(true);

    const payload = {
      timestamp: new Date().toISOString(),
      dataHoraFormatada: new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
      nome: this.elements.inputNome.value.trim(),
      sobrenome: this.elements.inputSobrenome.value.trim(),
      nomeCompleto: `${this.elements.inputNome.value.trim()} ${this.elements.inputSobrenome.value.trim()}`,
      email: this.elements.inputEmail.value.trim(),
      telefone: this.elements.inputTelefone ? this.elements.inputTelefone.value.trim() : "",
      cep: this.elements.inputCep.value.trim(),
      rua: this.elements.inputRua.value.trim(),
      numero: this.elements.inputNumero.value.trim(),
      complemento: this.elements.inputComplemento ? this.elements.inputComplemento.value.trim() : "",
      bairro: this.elements.inputBairro.value.trim(),
      cidade: this.elements.inputCidade.value.trim(),
      uf: this.elements.inputUf.value.trim().toUpperCase(),
      mensagem: this.elements.inputMensagem ? this.elements.inputMensagem.value.trim() : ""
    };

    this.saveLeadLocally(payload);

    const sheetsUrl = window.APP_CONFIG && window.APP_CONFIG.googleSheetsUrl;
    let sentToGoogleSheets = false;

    if (sheetsUrl && sheetsUrl.trim().startsWith("http")) {
      try {
        await fetch(sheetsUrl.trim(), {
          method: "POST",
          mode: "no-cors", 
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify(payload)
        });
        sentToGoogleSheets = true;
      } catch (err) {
        console.warn("[Contact] Erro ao enviar para o Google Sheets:", err);
      }
    }

    this.displaySuccessMessage(payload, sentToGoogleSheets);
    this.setSubmittingState(false);

    this.elements.form.reset();
    this.setCepStatus("Digite o CEP para buscar o endereço automaticamente", "normal");
  },

  saveLeadLocally(lead) {
    try {
      const storageKey = "smart_coletor_leads";
      const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
      existing.unshift(lead);
      localStorage.setItem(storageKey, JSON.stringify(existing.slice(0, 50)));
      console.info("[Contact] Lead armazenado localmente no navegador:", lead);
    } catch (e) {
      console.warn("[Contact] Não foi possível salvar no localStorage:", e);
    }
  },

  setSubmittingState(isSubmitting) {
    const { submitBtn } = this.elements;
    if (!submitBtn) return;

    submitBtn.disabled = isSubmitting;
    submitBtn.classList.toggle("is-loading", isSubmitting);

    const btnText = submitBtn.querySelector(".btn-text");
    if (btnText) {
      btnText.textContent = isSubmitting ? "Gravando dados..." : "Enviar dados de contato";
    }
  },

  displaySuccessMessage(payload, sentToGoogleSheets) {
    const { statusBox } = this.elements;
    if (!statusBox) return;

    statusBox.hidden = false;
    statusBox.className = "contact-status-box is-success";

    statusBox.innerHTML = `
      <div class="status-content">
        <div class="status-icon">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div class="status-text">
          <h4>Obrigado, ${this.escapeHtml(payload.nome)}!</h4>
          <p>Recebemos suas informações com sucesso. Nossa equipe entrará em contato em breve através do e-mail <strong>${this.escapeHtml(payload.email)}</strong>.</p>
        </div>
      </div>
    `;

    statusBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  },

  escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  logIntegrationStatus() {
    const sheetsUrl = window.APP_CONFIG && window.APP_CONFIG.googleSheetsUrl;
    if (sheetsUrl && sheetsUrl.trim().startsWith("http")) {
      console.log("%c[Smart Coletor] Google Sheets configurado com sucesso!", "color: #2EB85C; font-weight: bold;");
    } else {
      console.info("[Smart Coletor] Formulário de Contato ativo com backup local (localStorage). Para conectar à sua planilha, adicione a URL do Apps Script em js/config.js.");
    }
  }
};
