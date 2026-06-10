
// ===== VARIÁVEIS GLOBAIS =====
let cartas = [];
let cartasEmbaralhadas = [];
let cartasViradas = [];
let cartasCombinadas = [];
let bloqueado = false;
let podeJogar = true;

// Dados do jogo da memória (perguntas e respostas sobre agropecuária sustentável)
const paresDoJogo = [
    { pergunta: "O que é agropecuária sustentável?", resposta: "Produção equilibrada respeitando o meio ambiente" },
    { pergunta: "Qual técnica economiza água na irrigação?", resposta: "Irrigação por gotejamento" },
    { pergunta: "O que a rotação de culturas ajuda a preservar?", resposta: "A saúde do solo" },
    { pergunta: "Qual energia renovável pode ser usada no campo?", resposta: "Energia solar" }
];

// ===== FUNÇÃO PARA EMBARALHAR CARTAS =====
function embaralhar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ===== FUNÇÃO PARA CRIAR AS CARTAS DO JOGO =====
function criarCartas() {
    const cartasCriadas = [];
    
    // Para cada par, cria uma carta de pergunta e uma de resposta
    for (let i = 0; i < paresDoJogo.length; i++) {
        // Carta da pergunta
        cartasCriadas.push({
            id: i * 2,
            parId: i,
            tipo: "pergunta",
            texto: paresDoJogo[i].pergunta,
            combinada: false
        });
        
        // Carta da resposta
        cartasCriadas.push({
            id: i * 2 + 1,
            parId: i,
            tipo: "resposta",
            texto: paresDoJogo[i].resposta,
            combinada: false
        });
    }
    
    return embaralhar(cartasCriadas);
}

// ===== FUNÇÃO PARA RENDERIZAR O TABULEIRO =====
function renderizarTabuleiro() {
    const tabuleiro = document.getElementById("tabuleiroJogo");
    tabuleiro.innerHTML = "";
    
    for (let i = 0; i < cartasEmbaralhadas.length; i++) {
        const carta = cartasEmbaralhadas[i];
        const elementoCarta = document.createElement("div");
        elementoCarta.className = "carta";
        
        // Verifica se a carta está virada ou combinada
        if (carta.combinada) {
            elementoCarta.classList.add("combinada");
            elementoCarta.textContent = "✓";
        } else if (cartasViradas.includes(i)) {
            elementoCarta.classList.add("virada");
            elementoCarta.textContent = carta.texto;
        } else {
            elementoCarta.textContent = "❓ Agro";
        }
        
        elementoCarta.addEventListener("click", () => virarCarta(i));
        tabuleiro.appendChild(elementoCarta);
    }
}

// ===== FUNÇÃO PARA VIRAR CARTA =====
function virarCarta(indice) {
    // Verifica se pode jogar
    if (bloqueado || !podeJogar) return;
    
    const carta = cartasEmbaralhadas[indice];
    
    // Verifica se a carta já foi virada ou combinada
    if (cartasViradas.includes(indice) || carta.combinada) return;
    
    // Adiciona a carta às viradas
    cartasViradas.push(indice);
    
    // Se tem 2 cartas viradas, verifica o par
    if (cartasViradas.length === 2) {
        verificarPar();
    }
    
    renderizarTabuleiro();
}

// ===== FUNÇÃO PARA VERIFICAR SE AS CARTAS FORMAM UM PAR =====
function verificarPar() {
    bloqueado = true;
    
    const indice1 = cartasViradas[0];
    const indice2 = cartasViradas[1];
    const carta1 = cartasEmbaralhadas[indice1];
    const carta2 = cartasEmbaralhadas[indice2];
    
    // Verifica se as cartas são do mesmo par (pergunta e resposta)
    if (carta1.parId === carta2.parId && carta1.tipo !== carta2.tipo) {
        // Acertou! Marca as cartas como combinadas
        carta1.combinada = true;
        carta2.combinada = true;
        cartasViradas = [];
        
        // Verifica se o jogo acabou
        const todasCombinadas = cartasEmbaralhadas.every(carta => carta.combinada === true);
        
        if (todasCombinadas) {
            const mensagem = document.getElementById("mensagemJogo");
            mensagem.textContent = "🎉 Parabéns! Você completou o jogo! 🎉 Você aprendeu sobre agropecuária sustentável!";
        } else {
            const mensagem = document.getElementById("mensagemJogo");
            mensagem.textContent = "✅ Parabéns! Você acertou um par! Continue!";
            setTimeout(() => {
                mensagem.textContent = "";
            }, 2000);
        }
        
        bloqueado = false;
        renderizarTabuleiro();
    } else {
        // Errou! Mostra mensagem e desvira as cartas
        const mensagem = document.getElementById("mensagemJogo");
        mensagem.textContent = "❌ Não formam um par! Tente novamente!";
        
        setTimeout(() => {
            cartasViradas = [];
            bloqueado = false;
            renderizarTabuleiro();
            mensagem.textContent = "";
        }, 1000);
    }
}

// ===== FUNÇÃO PARA REINICIAR O JOGO =====
function reiniciarJogo() {
    cartasViradas = [];
    cartasCombinadas = [];
    bloqueado = false;
    podeJogar = true;
    cartasEmbaralhadas = criarCartas();
    renderizarTabuleiro();
    
    const mensagem = document.getElementById("mensagemJogo");
    mensagem.textContent = "Jogo reiniciado! Boa sorte!";
    setTimeout(() => {
        mensagem.textContent = "";
    }, 2000);
}

// ===== FUNÇÕES DE ACESSIBILIDADE =====
// Aumentar fonte
function aumentarFonte() {
    let tamanhoAtual = parseFloat(getComputedStyle(document.body).fontSize);
    if (tamanhoAtual < 24) {
        document.body.style.fontSize = (tamanhoAtual + 2) + "px";
    }
}

// Diminuir fonte
function diminuirFonte() {
    let tamanhoAtual = parseFloat(getComputedStyle(document.body).fontSize);
    if (tamanhoAtual > 12) {
        document.body.style.fontSize = (tamanhoAtual - 2) + "px";
    }
}

// Ativar/desativar alto contraste
function ativarAltoContraste() {
    document.body.classList.toggle("alto-contraste");
}

// ===== MENU DE ACESSIBILIDADE =====
function alternarMenuAcessibilidade() {
    const menu = document.getElementById("menuAcessibilidade");
    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "flex";
    } else {
        menu.style.display = "none";
    }
}

// ===== INICIALIZAÇÃO DO SITE =====
document.addEventListener("DOMContentLoaded", function() {
    // Inicializa o jogo
    cartasEmbaralhadas = criarCartas();
    renderizarTabuleiro();
    
    // Configura os botões
    const btnReiniciar = document.getElementById("reiniciarJogo");
    if (btnReiniciar) {
        btnReiniciar.addEventListener("click", reiniciarJogo);
    }
    
    // Configura os botões de acessibilidade
    const btnAcessibilidade = document.getElementById("btnAcessibilidade");
    if (btnAcessibilidade) {
        btnAcessibilidade.addEventListener("click", alternarMenuAcessibilidade);
    }
    
    const btnAumentar = document.getElementById("aumentarFonte");
    if (btnAumentar) {
        btnAumentar.addEventListener("click", aumentarFonte);
    }
    
    const btnDiminuir = document.getElementById("diminuirFonte");
    if (btnDiminuir) {
        btnDiminuir.addEventListener("click", diminuirFonte);
    }
    
    const btnContraste = document.getElementById("altoContraste");
    if (btnContraste) {
        btnContraste.addEventListener("click", ativarAltoContraste);
    }
});
