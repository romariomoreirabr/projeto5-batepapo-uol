// Variáveis Globais
const URLApiParticipantes = "https://mock-api.driven.com.br/api/v4/uol/participants";
const URLApiStatus = "https://mock-api.driven.com.br/api/v4/uol/status";
const URLApiMensagens = "https://mock-api.driven.com.br/api/v4/uol/messages";
let nome = null;
let usuario = {name : nome};
let funcaoQueChamou = 0;
let mensagens = [];

//_______________________________________FUNÇÕES_________________________________________________
function entrarNoSite() {
    nome = prompt("Insira seu nome: ");
    console.log("Nome : " + nome);
    funcaoQueChamou = 1;
    cadastrarUsuario(nome);
}

function cadastrarUsuario (nomeUsuario) {
    usuario = {
        name : nomeUsuario
    }
    const promessParticipantes = axios.post(URLApiParticipantes, usuario);
    promessParticipantes.then(promessPostSucesso);
    promessParticipantes.catch(promessPostErro); 
}

function abrirMenuLateral() {
    let menuLateral = document.querySelector("nav");
    menuLateral.classList.remove("escondido");
}

function fecharMenuLateral() {
    let menuLateral = document.querySelector("nav");
    menuLateral.classList.add("escondido");
}

// Mostar usuários cadastrados no console
function mostrarUsuariosCadastrados () {
    const promessParticipantes = axios.get(URLApiParticipantes);
    promessParticipantes.then(promessGetSucesso);
    promessParticipantes.catch(promessGetErro);
    funcaoQueChamou = 3;
}

// Função Manter Conexão
function manterConexao () {
    const promessStatus = axios.post(URLApiStatus, usuario);
    console.log("Mantendo conexão ativa");
}
function atualizarStatus(){
    setInterval(manterConexao, 5000);
    setInterval(buscarMensagens, 3000);
}
//-------FUNÇÕES DE CADASTRO DE MENSAGENS--------
function prepararMensagem(){
    let mensagemDigitada = document.querySelector("input").value;
    let mensagemEnviar = {
        from: nome,
	    to: "Todos",
	    text: mensagemDigitada,
	    type: "message" // ou "private_message" para o bônus
    }
    enviarMensagem(mensagemEnviar);
}

function enviarMensagem (mensagemObj){
    funcaoQueChamou = 4;
    const promessMensagem = axios.post(URLApiMensagens, mensagemObj);
    promessMensagem.then(promessPostSucesso);
    promessMensagem.catch(promessPostErro);

}

//-------FIM DAS FUNÇÕES DE CADASTRO DE MENSAGENS--------

//-------FUNÇÕES DE BUSCA DE MENSAGENS--------
function buscarMensagens () {
    const promessMensagens = axios.get(URLApiMensagens);
    funcaoQueChamou = 2;
    promessMensagens.then(promessGetSucesso);
    promessMensagens.catch(promessGetErro);
    let main = document.querySelector("main");
    main.innerHTML = "";
}
function percorrerMensagens (arrayDeMensagens) {
    for (let i = 0; i < arrayDeMensagens.length; i++){
        let mensagem = arrayDeMensagens[i];
        // console.log(mensagem); //from; to; text; type; time
        renderizarMensagem(mensagem);
    } 
}
//-------FIM FUNÇÕES DE BUSCA DE MENSAGENS--------

function renderizarMensagem (mensagem) {
    //type: status, message, private-message
    let main = document.querySelector("main");
    if (mensagem.type === "status"){
        main.innerHTML += `
        <div class="entra__sai__na__sala" data-identifier="message"><span>${mensagem.time} </span><strong>${mensagem.from}</strong>
          ${mensagem.text}</div>
        `;
    } else if (mensagem.type === "message") {
        main.innerHTML += `
        <div class="para__todos" data-identifier="message"><span>${mensagem.time} </span><strong>${mensagem.from}</strong> para <strong>${mensagem.to}</strong>:
          ${mensagem.text}</div>
        `
    } else if (mensagem.type === "private-message" && (mensagem.to == nome || mensagem.from == nome)) {
        main.innerHTML += `
        <div class="privado" data-identifier="message"><span>${mensagem.time} </span><strong>${mensagem.from}</strong> para <strong>${mensagem.to}</strong>:
          ${mensagem.text}</div>
        `
    }  
    main.scrollIntoView({block: "end"});
}

//-------------------FUNÇÕES POST E GET---------------------
function promessPostSucesso (resposta) {
    if (funcaoQueChamou === 1) {
        atualizarStatus(); 
    }
    else if (funcaoQueChamou === 4){
        let mensagemDigitada = document.querySelector("input").value = "";
    }
    buscarMensagens();
}
function promessPostErro (erro) {
    console.log(erro);
    if (erro.response.status == 400){
        alert("Já existe um usuário com o nome " + nome);
        entrarNoSite();
    }
    if (funcaoQueChamou === 4){
        window.location.reload();
    }
}
function promessGetSucesso (resposta) {
    let ArrayDeDados = resposta.data;
    // console.log(ArrayDeDados);
    if(funcaoQueChamou === 2){ 
        mensagens = ArrayDeDados;
        percorrerMensagens(mensagens); 
    }
}
function promessGetErro (erro) {
    console.log(erro);
}
//--------==----FIM DAS FUNÇÕES POST E GET--------==-------

// Comandos iniciais
mostrarUsuariosCadastrados();
entrarNoSite();
// setTimeout(entrarNoSite, 10000);

