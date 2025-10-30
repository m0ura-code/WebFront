
document.getElementById("cpf").addEventListener("input", function () {
  let cpf = this.value.replace(/\D/g, "");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  this.value = cpf;
});

document.getElementById("telefone").addEventListener("input", function () {
  let tel = this.value.replace(/\D/g, "");
  tel = tel.replace(/^(\d{2})(\d)/g, "($1) $2");
  tel = tel.replace(/(\d{5})(\d{4})$/, "$1-$2");
  this.value = tel;
});

document.getElementById("cep").addEventListener("input", function () {
  let cep = this.value.replace(/\D/g, "");
  cep = cep.replace(/(\d{5})(\d{3})$/, "$1-$2");
  this.value = cep;
});

const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");


menuToggle.textContent = "☰";


menuToggle.addEventListener("click", () => {
  menu.classList.toggle("show");
  menuToggle.textContent = menu.classList.contains("show") ? "✖" : "☰";
});

const form = document.getElementById("cadastroForm");
const alerta = document.getElementById("alerta");
const fecharAlerta = document.getElementById("fecharAlerta");

form.addEventListener("submit", function (event) {
  event.preventDefault(); 
  alerta.style.display = "flex"; 
});

fecharAlerta.addEventListener("click", function () {
  alerta.style.display = "none";
});

document.addEventListener("DOMContentLoaded", function () {
  const formVol = document.getElementById("voluntarioForm");
  const alertaVol = document.getElementById("alertaVoluntario");
  const fecharVol = document.getElementById("fecharAlertaVoluntario");

  if (formVol) {
    formVol.addEventListener("submit", function (e) {
      e.preventDefault(); 
      alertaVol.classList.add("mostrar");
    });
  }

  if (fecharVol) {
    fecharVol.addEventListener("click", function () {
      alertaVol.classList.remove("mostrar");
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll('a[href$=".html"]');
  const main = document.querySelector("main");

  links.forEach(link => {
    link.addEventListener("click", async (e) => {
      const href = link.getAttribute("href");


      if (!href.startsWith("http") && !href.includes("#")) {
        e.preventDefault();

        try {
          const response = await fetch(href);
          const text = await response.text();

  
          const parser = new DOMParser();
          const newDoc = parser.parseFromString(text, "text/html");
          const newMain = newDoc.querySelector("main");

          if (newMain) {
            main.innerHTML = newMain.innerHTML;
            window.history.pushState({}, "", href);
            document.title = newDoc.title; 
          }
        } catch (error) {
          console.error("Erro ao carregar a página:", error);
        }
      }
    });
  });

  window.addEventListener("popstate", () => {
    location.reload();
  });
});

function criarCardProjeto(titulo, descricao, imagem, link) {
  return `
    <div class="card">
      <img src="${imagem}" alt="${titulo}" class="livros">
      <h3>${titulo}</h3>
      <p>${descricao}</p>
      <a href="${link}" class="btn-secundario">Saiba Mais</a>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll('a[href$=".html"]');
  const main = document.querySelector("main");

  links.forEach(link => {
    link.addEventListener("click", async (e) => {
      const href = link.getAttribute("href");

    
      if (href.startsWith("http") || href.startsWith("#")) return;

      e.preventDefault();

      try {
        const response = await fetch(href);
        if (!response.ok) throw new Error("Página não encontrada");

        const text = await response.text();
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(text, "text/html");
        const newMain = newDoc.querySelector("main");

        if (newMain) {
          main.innerHTML = newMain.innerHTML;
          window.history.pushState({}, "", href);
          document.title = newDoc.title;

         
          document.querySelectorAll("nav a").forEach(a => a.classList.remove("ativo"));
          const linkAtivo = document.querySelector(`nav a[href="${href}"]`);
          if (linkAtivo) linkAtivo.classList.add("ativo");

    
          const scripts = newDoc.querySelectorAll("script");
          scripts.forEach(oldScript => {
            const newScript = document.createElement("script");
            if (oldScript.src) newScript.src = oldScript.src;
            else newScript.textContent = oldScript.textContent;
            document.body.appendChild(newScript);
          });
        }
      } catch (error) {
        console.error("Erro ao carregar página:", error);
        window.location.href = href;
      }
    });
  });

  window.addEventListener("popstate", async () => {
    const href = window.location.pathname.split("/").pop();
    try {
      const response = await fetch(href);
      const text = await response.text();
      const parser = new DOMParser();
      const newDoc = parser.parseFromString(text, "text/html");
      const newMain = newDoc.querySelector("main");
      if (newMain) document.querySelector("main").innerHTML = newMain.innerHTML;
    } catch {
      location.reload();
    }
  });
});


function mostrarErro(input, mensagem) {
  input.style.borderColor = "red";

  let erro = input.nextElementSibling;
  if (!erro || !erro.classList.contains("erro-msg")) {
    erro = document.createElement("small");
    erro.className = "erro-msg";
    erro.style.color = "red";
    erro.textContent = mensagem;
    input.insertAdjacentElement("afterend", erro);
  } else {
    erro.textContent = mensagem;
  }
}

function limparErro(input) {
  input.style.borderColor = "";
  const erro = input.nextElementSibling;
  if (erro && erro.classList.contains("erro-msg")) {
    erro.remove();
  }
}

function validarCPF(cpf) {
  return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarTelefone(tel) {
  return /^\(\d{2}\)\s?\d{5}-\d{4}$/.test(tel);
}

document.addEventListener("submit", (e) => {
  const form = e.target;
  if (!form.matches("form")) return;

  let valido = true;

  const campos = form.querySelectorAll("input[required]");
  campos.forEach((input) => {
    limparErro(input);
    if (!input.value.trim()) {
      mostrarErro(input, "Este campo é obrigatório.");
      valido = false;
    } else if (input.id === "cpf" && !validarCPF(input.value)) {
      mostrarErro(input, "CPF inválido.");
      valido = false;
    } else if (input.id === "email" && !validarEmail(input.value)) {
      mostrarErro(input, "E-mail inválido.");
      valido = false;
    } else if (input.id === "telefone" && !validarTelefone(input.value)) {
      mostrarErro(input, "Telefone inválido.");
      valido = false;
    }
  });

  if (!valido) {
    e.preventDefault();
    alert("Por favor, corrija os erros antes de enviar.");
  }
});
