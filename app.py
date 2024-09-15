from flask import Flask, render_template, request
import database.database as database
import json

from config import IDS_TO_TABLES
app = Flask(__name__)

# rota para as mesas
@app.route('/m/<path:subpath>', methods=['GET'])
def home(subpath):
    table_id = IDS_TO_TABLES.get(subpath, None)
    if table_id:
        return render_template('cliente.html', id_mesa=table_id)
    else:
        return 'PAGINA NÃO ENCONTRADA'
    
@app.route('/cozinha', methods=['GET'])
def vendedor():
    return render_template('cozinha.html')

@app.route('/post-pedido-carrinho', methods=['POST'])
def post_pedido_carrinho():
    data = request.get_json()
    return database.post_pedido_carrinho(data)

@app.route('/delete-pedido-carrinho', methods=['POST'])
def delete_pedido_carrinho():
    data = request.get_json()
    return database.delete_pedido_carrinho(data)

@app.route('/post-pedido', methods=['POST'])
def post_pedido():
    data = request.get_json()
    return database.post_pedido(data)

@app.route('/get-carrinho', methods=['GET'])
def get_carrinho():
    id_mesa = request.args.get('id_mesa')
    return database.get_carrinho(id_mesa)

@app.route('/get-pedidos-mesa', methods=['GET'])
def get_pedidos_mesa():
    id_mesa = request.args.get('id_mesa')
    return database.get_pedidos_mesa(id_mesa)

@app.route('/get-pedidos', methods=['GET'])
def get_pedidos():
    return database.get_pedidos()

@app.route('/incrementar-quantidade', methods=['POST'])
def incrementar_quantidade():
    data = request.get_json()
    return database.incrementar_quantidade(data)

@app.route('/delete-carrinho', methods=['POST'])
def deletar_carrinho():
    data = request.get_json()
    return database.deletar_carrinho(data)

@app.route('/finalizar-pedido/<path:id_pedido>', methods=['GET'])
def finailzar_pedido(id_pedido):
    return database.finalizar_pedido(id_pedido)

if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True, port='5000')