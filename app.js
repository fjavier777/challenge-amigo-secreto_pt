//O principal objetivo deste desafio é fortalecer suas habilidades em lógica de programação. Aqui você deverá desenvolver a lógica para resolver o problema.
// Criando listas vazias para guardar os nomes dos amigos
var listaDeAmigos = [];
var listaDeSorteio = [];

// Quando a página carregar, verificar se tem amigos salvos
window.onload = function() {
  // Tentar recuperar amigos salvos anteriormente
  if (localStorage.getItem('meusAmigos')) {
    // Converter de texto para lista
    listaDeAmigos = JSON.parse(localStorage.getItem('meusAmigos'));
    // Mostrar a lista na tela
    mostrarAmigosNaTela();
  }
}

// Função para adicionar um novo amigo
function adicionarAmigo() {
  // Pegar o que foi digitado na caixa de texto
  var caixaDeTexto = document.getElementById('amigo');
  var nomeDoAmigo = caixaDeTexto.value;
  
  // Verificar se a pessoa digitou alguma coisa
  if (nomeDoAmigo == '') {
    // Mostrar mensagem no resultado
    var elementoResultado = document.getElementById('resultado');
    elementoResultado.innerHTML = '<li>Por favor, digite o nome do seu amigo!</li>';
    setTimeout(function() {
      elementoResultado.innerHTML = '';
    }, 3000);
    return;
  }
  
  // Adicionar o nome no final da lista
  listaDeAmigos.push(nomeDoAmigo);
  
  // Limpar a caixa de texto
  caixaDeTexto.value = '';
  // Focar na caixa para digitar outro nome
  caixaDeTexto.focus();
  
  // Atualizar a lista na tela
  mostrarAmigosNaTela();
  
  // Mostrar mensagem de confirmação
  var elementoResultado = document.getElementById('resultado');
  elementoResultado.innerHTML = '<li>Amigo adicionado com sucesso!</li>';
  setTimeout(function() {
    elementoResultado.innerHTML = '';
  }, 2000);
  
  // Salvar a lista no computador
  localStorage.setItem('meusAmigos', JSON.stringify(listaDeAmigos));
}

// Função para mostrar os amigos na tela
function mostrarAmigosNaTela() {
  // Encontrar a lista na página
  var elementoDaLista = document.getElementById('listaAmigos');
  // Limpar a lista atual
  elementoDaLista.innerHTML = '';
  
  // Para cada amigo na lista...
  for (var i = 0; i < listaDeAmigos.length; i++) {
    // Criar um novo item de lista
    var novoItem = document.createElement("li");
    // Colocar o nome do amigo no item
    novoItem.textContent = listaDeAmigos[i];
    // Adicionar o item na lista da página
    elementoDaLista.appendChild(novoItem);
  }
}

// Função para sortear um amigo
function sortearAmigo() {
  // Limpar resultados anteriores
  var elementoResultado = document.getElementById('resultado');
  elementoResultado.innerHTML = '';
  
  // Verificar se tem amigos na lista
  if (listaDeAmigos.length == 0) {
    elementoResultado.innerHTML = '<li>Você precisa adicionar amigos primeiro!</li>';
    return;
  }
  
  // Verificar se tem pelo menos dois amigos
  if (listaDeAmigos.length < 2) {
    elementoResultado.innerHTML = '<li>Adicione pelo menos dois amigos para sortear!</li>';
    return;
  }
  
  // Se a lista de sorteio estiver vazia, preparar para o sorteio
  if (listaDeSorteio.length == 0) {
    prepararListaDeSorteio();
  }
  
  // Mostrar animação de sorteio
  elementoResultado.innerHTML = '<li>Sorteando...</li>';
  
  // Realizar o sorteio após um breve atraso
  setTimeout(function() {
    realizarSorteio(elementoResultado);
  }, 800);
}

// Função para preparar a lista de sorteio
function prepararListaDeSorteio() {
  listaDeSorteio = [];
  
  // Criar um par para cada pessoa
  for (var i = 0; i < listaDeAmigos.length; i++) {
    var pessoaAtual = listaDeAmigos[i];
    var parPossivel = [];
    
    // Adicionar todas as pessoas, exceto ela mesma
    for (var j = 0; j < listaDeAmigos.length; j++) {
      if (i != j) {
        parPossivel.push(listaDeAmigos[j]);
      }
    }
    
    // Adicionar na lista de sorteio
    listaDeSorteio.push({
      pessoa: pessoaAtual,
      pares: parPossivel,
      parSorteado: null
    });
  }
}

// Função para realizar o sorteio
function realizarSorteio(elementoResultado) {
  // Escolher aleatoriamente a pessoa que vai tirar
  var indiceQuemTira = Math.floor(Math.random() * listaDeSorteio.length);
  var quemTira = listaDeSorteio[indiceQuemTira];
  
  // Verificar se há pares disponíveis
  if (quemTira.pares.length == 0) {
    // Reiniciar o sorteio se não houver pares disponíveis
    prepararListaDeSorteio();
    elementoResultado.innerHTML = '<li>Reiniciando sorteio...</li>';
    setTimeout(function() {
      realizarSorteio(elementoResultado);
    }, 800);
    return;
  }
  
  // Sortear um par
  var indicePar = Math.floor(Math.random() * quemTira.pares.length);
  var parSorteado = quemTira.pares[indicePar];
  
  // Mostrar o resultado
  elementoResultado.innerHTML = '<li>' + quemTira.pessoa + ' tirou: ' + parSorteado + '</li>';
  
  // Atualizar quem já foi sorteado
  quemTira.parSorteado = parSorteado;
  
  // Remover a pessoa da lista de sorteio
  listaDeSorteio.splice(indiceQuemTira, 1);
  
  // Remover o par sorteado das listas de pares disponíveis
  for (var i = 0; i < listaDeSorteio.length; i++) {
    var indiceParaRemover = listaDeSorteio[i].pares.indexOf(parSorteado);
    if (indiceParaRemover > -1) {
      listaDeSorteio[i].pares.splice(indiceParaRemover, 1);
    }
  }
  
  // Verificar se precisa reiniciar sorteio
  if (listaDeSorteio.length == 0) {
    setTimeout(function() {
      elementoResultado.innerHTML += '<li>Sorteio completo!</li>';
    }, 2000);
  }
}

// Adicionar evento de tecla para permitir adicionar com Enter
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    var inputAmigo = document.getElementById('amigo');
    if (document.activeElement === inputAmigo) {
      adicionarAmigo();
    }
  }
});