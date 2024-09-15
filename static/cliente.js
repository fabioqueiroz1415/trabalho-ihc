function enviar_pedido(id_mesa) {
  if (!id_mesa) {
    mostra_texto_carrinho('preencha o campo id_mesa');
    return;
  }
  data = {
    id_mesa: id_mesa,
    itens: []
  }
  tabela_carrinho = document.getElementById('carrinho');
  for (let i = 0; i < tabela_carrinho.rows.length; i++) {
    data.itens.push({
      id_item: tabela_carrinho.rows[i].cells[0].innerHTML,
      item: tabela_carrinho.rows[i].cells[1].innerHTML,
      valor: tabela_carrinho.rows[i].cells[2].innerHTML,
      quantidade: tabela_carrinho.rows[i].cells[3].innerHTML
    });
  }
  enviar_pedido_bd(data);
}

function enviar_pedido_bd(data) {
  mostra_texto_carrinho('enviando pedido...');
  fetch('/post-pedido', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(d => {
    if (d.status === 200) {
      limpar_carrinho(data.id_mesa);
      atualizar_pedidos_mesa(data.id_mesa);
    }
    mostra_texto_carrinho(d.message);
  })
  .catch((error) => {
    mostra_texto_carrinho(error);
  });
}

function atualizar_pedidos_mesa(id_mesa) {
  mostra_texto_pedidos('atualizando pedidos...');
  fetch(`/get-pedidos-mesa?id_mesa=${id_mesa}`)
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
        add_pedido_mesa_html(pedido.id_pedido, item.item, item.quantidade, parseFloat(item.valor).toFixed(2));
      });
    });
    mostra_texto_pedidos('pedidos atualizados');
  });
}

function add_pedido_mesa_html(id_pedido, item, quantidade, valor) {
  var table = document.getElementById('pedidos');
  var row = table.insertRow();
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  cell1.innerHTML = id_pedido;
  cell2.innerHTML = item;
  cell3.innerHTML = quantidade;
  cell4.innerHTML = valor;
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