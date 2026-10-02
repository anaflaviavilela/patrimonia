/*BEGIN - CONFIGURAÇÃO DA API */
/*const API_URL = 'http://localhost:3000/api';*/
const API_URL = 'https://patrimonia-api.onrender.com';
/*END - CONFIGURAÇÃO DA API */

/*BEGIN - FUNÇÕES DE VALIDAÇÃO E UI */

// 1. FUNÇÕES UTILITÁRIAS (validações puras)
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validarSenha(senha) {
  if (!senha || senha.length < 8) {
    return { valido: false, erro: "Senha deve ter pelo menos 8 caracteres." };
  }
  if (!/[A-Z]/.test(senha)) {
    return { valido: false, erro: "Senha deve ter pelo menos uma letra maiúscula." };
  }
  if (!/\d/.test(senha)) {
    return { valido: false, erro: "Senha deve ter pelo menos um número." };
  }
  if (!/[!@#$%^&*()_+{}:;<>,.?~\/-]/.test(senha)) {
    return { valido: false, erro: "Senha deve ter pelo menos um caractere especial." };
  }
  return { valido: true, erro: null };
}

// 2. FUNÇÕES DE UI (manipulam DOM)
function mostrarErro(campo, mensagem) {
  const erroElemento = document.getElementById(`error-${campo}`);
  if (erroElemento) {
    erroElemento.textContent = mensagem;
    erroElemento.style.display = 'block';
  }
}

function limparErro(campo) {
  const erroElemento = document.getElementById(`error-${campo}`);
  if (erroElemento) {
    erroElemento.textContent = '';
    erroElemento.style.display = 'none';
  }
}

function limparCampos(formulario) {
  if (formulario === 'cadastro') {
    document.getElementById('nome').value = '';
    document.getElementById('email-cad').value = '';
    document.getElementById('senha-cad').value = '';
    document.getElementById('senha-conf').value = '';
    const termos = document.querySelector(".terms input[type='checkbox']");
    if (termos) termos.checked = false;
  }

  if (formulario === 'login') {
    document.getElementById('email').value = '';
    document.getElementById('senha').value = '';
  }
}

function mostrarAba(aba) {
  const eEntrar = aba === 'entrar';
  document.getElementById('form-entrar').style.display = eEntrar ? 'block' : 'none';
  document.getElementById('form-cadastro').style.display = eEntrar ? 'none' : 'block';
  document.getElementById('tab-entrar').classList.toggle('active', eEntrar);
  document.getElementById('tab-cadastro').classList.toggle('active', !eEntrar);
}

function mostrarSucesso(mensagem) {
  const sucessoElemento = document.getElementById('mensagem-sucesso');
  if (sucessoElemento) {
    sucessoElemento.textContent = mensagem;
    sucessoElemento.classList.add('visivel');
    setTimeout(() => {
      sucessoElemento.classList.remove('visivel');
    }, 4000);
  }
}

/*END - FUNÇÕES DE VALIDAÇÃO E UI */

//--------------------------------------------------------------------------

/*BEGIN - SELEÇÃO DE ELEMENTOS */

const formEntrar = document.getElementById("form-entrar");
const email = document.getElementById("email");
const senha = document.getElementById("senha");

const formCadastro = document.getElementById("form-cadastro");
const nome = document.getElementById("nome");
const emailCadastro = document.getElementById("email-cad");
const senhaCadastro = document.getElementById("senha-cad");
const confSenha = document.getElementById("senha-conf");
const termosUso = document.getElementById("termos");

/*END - SELEÇÃO DE ELEMENTOS */

//--------------------------------------------------------------------------

/*BEGIN - EVENT LISTENERS */

// Event listeners para limpar erro ao digitar (login)
if (email) email.addEventListener("input", () => limparErro(email.id));
if (senha) senha.addEventListener("input", () => limparErro(senha.id));

// Event listener para login (Conectado ao Backend)
if (formEntrar) {
  formEntrar.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    limparErro(email.id);
    limparErro(senha.id);

    if (!email.value || !validarEmail(email.value)) {
      mostrarErro(email.id, "Por favor, preencha o campo de e-mail corretamente.");
      return;
    }

    // No login não reaplicamos as regras de força de senha (isso é para
    // cadastro). Aqui só garantimos que o campo foi preenchido; quem decide
    // se a senha está correta é o backend.
    if (!senha.value) {
      mostrarErro(senha.id, "Por favor, preencha o campo de senha.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
          password: senha.value
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        mostrarErro(email.id, data.error || "E-mail ou senha incorretos.");
        return;
      }

      // Salva o token JWT e os dados do usuário no localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuarioLogado", JSON.stringify(data.user));

      window.location.href = '../dashboard/dashboard.html';
    } catch (error) {
      mostrarErro(email.id, "Erro ao conectar com o servidor.");
      console.error(error);
    }
  });
}

// Event listener para cadastro (Conectado ao Backend)
if (formCadastro) {
  formCadastro.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    // Limpa erros de uma submissão anterior antes de validar novamente
    limparErro(nome.id);
    limparErro(emailCadastro.id);
    limparErro(senhaCadastro.id);
    limparErro(confSenha.id);
    limparErro("termos");

    if (!nome.value) {
      mostrarErro(nome.id, "Por favor, preencha o campo de nome.");
      return;
    }
    if (!emailCadastro.value || !validarEmail(emailCadastro.value)) {
      mostrarErro(emailCadastro.id, "Por favor, preencha o campo de e-mail corretamente.");
      return;
    }
    const validacaoSenha = validarSenha(senhaCadastro.value);
    if (!validacaoSenha.valido) {
      mostrarErro(senhaCadastro.id, validacaoSenha.erro);
      return;
    }
    if (!confSenha.value || confSenha.value !== senhaCadastro.value) {
      mostrarErro(confSenha.id, "As senhas não coincidem.");
      return;
    }
    if (!termosUso.checked) {
      mostrarErro("termos", "Você deve aceitar os Termos de Uso e a Política de Privacidade.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nome.value,
          email: emailCadastro.value,
          password: senhaCadastro.value
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        mostrarErro(emailCadastro.id, data.error || "Erro ao realizar cadastro.");
        return;
      }

      limparCampos('cadastro');
      mostrarSucesso("Cadastro realizado com sucesso! Verifique seu e-mail.");
      mostrarAba('entrar');
    } catch (error) {
      mostrarErro(emailCadastro.id, "Erro ao conectar com o servidor.");
      console.error(error);
    }
  });
}

// Inicialização: verifica hash na URL
if (window.location.hash === '#cadastro') {
  mostrarAba('cadastro');
}

/*END - EVENT LISTENERS */