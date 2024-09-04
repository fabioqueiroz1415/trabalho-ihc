function atualizar_pedidos() {
  mostra_texto_pedidos('atualizando pedidos...');
  fetch(`/get-pedidos`)
  .then(response => response.json())
  .then(data => {
    if (!data) {
      mostra_texto_pedidos('pedidos vazios');
      return;
    }
    var table = document.getElementById('pedidos');
    table.innerHTML = '';
    data.forEach(pedido => {
      //inserir texto pedido dps
      pedido.itens.forEach(item => {
        
        add_pedido_mesa_html(item.id, pedido.data_hora, pedido.id_mesa, item.item, item.quantidade, parseFloat(item.valor).toFixed(2), pedido.id_pedido);
      });
    });
    mostra_texto_pedidos('pedidos atualizados');
  });
}

function add_pedido_mesa_html(id, data_hora, id_mesa, item, quantidade, valor, id_pedido) {
  var table = document.getElementById('pedidos');
  var row = table.insertRow();
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);
  var cell7 = row.insertCell(6);
  var cell8 = row.insertCell(7);
  //data e hora, mesa, item, quantidade, valor, id_pedido
  cell1.innerHTML = id;
  cell2.innerHTML = data_hora;
  cell3.innerHTML = id_mesa;
  cell4.innerHTML = item;
  cell5.innerHTML = quantidade;
  cell6.innerHTML = valor;
  cell7.innerHTML = id_pedido;
}

function limpar_carrinho(id_mesa) {
  if (!id_mesa) {
    mostra_texto_carrinho('preencha o campo id_mesa');
    return;
  }
  var data = {
    id_mesa: id_mesa
  };
  limpar_carrinho_bd(data);
}

function limpar_carrinho_bd(data) {
  mostra_texto_carrinho('limpando carrinho...');
  fetch('/delete-carrinho', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(d => {
    if (d.status === 200) {
      atualizar_carrinho(data.id_mesa);
      mostra_texto_carrinho('carrinho limpo');
    }
    mostra_texto_carrinho(d.message);
  })
  .catch((error) => {
    mostra_texto_carrinho(error);
  });
}

function deletar_pedido_carrinho(id_mesa, id_item) {
  if(!id_mesa || !id_item) {
    mostra_texto_carrinho('preencha o campo id_item');
    return;
  }

  var data = {
    id_mesa: id_mesa,
    id_item: id_item
  };
  deletar_pedido_carrinho_bd(data);
}


function deletar_pedido_carrinho_bd(data) {
  mostra_texto_carrinho('deletando pedido...');
  fetch('/delete-pedido-carrinho', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(d => {
    if (d.status === 200) {
      atualizar_carrinho(data.id_mesa)
    }
    mostra_texto_carrinho(d.message);
  })
  .catch((error) => {
    mostra_texto_carrinho(error);
  });
}
function add_pedido_carrinho(id_mesa, item, id_item, valor, quantidade) {
  if (!id_mesa || !item || !valor || !quantidade || !id_item) {
    mostra_texto_carrinho('preencha todos os campos');
    return;
  }
  var data = {
    id_mesa: id_mesa,
    item: item,
    id_item: id_item,
    valor: parseFloat(valor).toFixed(2),
    quantidade: quantidade
  };
  add_pedido_carrinho_bd(data);
}

function add_pedido_carrinho_html(item, id_item, valor, quantidade) {
  var table = document.getElementById('carrinho');
  var row = table.insertRow();
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  cell1.innerHTML = id_item;
  cell2.innerHTML = item;
  cell3.innerHTML = valor;
  cell4.innerHTML = quantidade;
}

async function add_pedido_carrinho_bd(data) {
  mostra_texto_carrinho('adicionando pedido...');
  await fetch('/post-pedido-carrinho', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(d => {
    if (d.status === 200) {
      add_pedido_carrinho_html(item=data.item, id_item=data.id_item, valor=data.valor, quantidade=data.quantidade);
    }
    mostra_texto_carrinho(d.message);
  })
  .catch((error) => {
    mostra_texto_carrinho(error);
  });
}

function mostra_texto_carrinho(texto, time=4000) {
  var p = document.getElementById('texto-carrinho');
  p.innerHTML = texto;
  setTimeout(() => {
    p.innerHTML = '';
  }, time);
}

function mostra_texto_pedidos(texto, time=4000) {
  var p = document.getElementById('texto-pedidos');
  p.innerHTML = texto;
  setTimeout(() => {
    p.innerHTML = '';
  }, time);
}

function atualizar_carrinho(id_mesa) {
  fetch(`/get-carrinho?id_mesa=${id_mesa}`)
  .then(response => response.json())
  .then(data => {
    if (!data) {
      mostra_texto_carrinho('carrinho vazio');
      return;
    }
    var table = document.getElementById('carrinho');
    table.innerHTML = '';
    data.forEach(pedido => {
      add_pedido_carrinho_html(pedido.item, pedido.id_item, parseFloat(pedido.valor).toFixed(2), pedido.quantidade);
    });
    mostra_texto_carrinho('carrinho atualizado');
  });
}

function incrementar_quantidade(id_mesa, id_item, incremento) {
  if (!id_mesa || !id_item || !incremento) {
    mostra_texto_carrinho('preencha todos os campos');
    return;
  }
  var data = {
    id_mesa: id_mesa,
    id_item: id_item,
    incremento: incremento
  };
  incrementar_quantidade_bd(data);
}
function incrementar_quantidade_bd(data) {
  mostra_texto_carrinho('incrementando quantidade...');
  fetch('/incrementar-quantidade', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(d => {
    if (d.status === 200) {
      atualizar_carrinho(data.id_mesa);
    }
    mostra_texto_carrinho(d.message);
  })
  .catch((error) => {
    mostra_texto_carrinho(error);
  });
}