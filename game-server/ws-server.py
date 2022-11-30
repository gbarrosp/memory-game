import sys, os
import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web
import json

clients = []
class SocketHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        print('WebSocket opened')
        clients.append(self)

    def on_message(self, message):
        print(f'Received: {json.loads(message)}')
        sequence = json.loads(message)['message']['sequence']
        owner = json.loads(message)['message']['owner']
        if owner == 'board':
            if len(sequence) == 1:
                message = {"roundStart": True}
            elif len(sequence) == 2:
                message = {"roundEnd": True}
            else:
                self.last_sequence = sequence
                message = {"getSequence": True}
        else:
            result = self.last_sequence == sequence
            message = {"player": owner, "result": result}
        for w in clients:
            w.write_message(message)

    def on_close(self):
        print('WebSocket closed')
        clients.remove(self)

    def check_origin(self, origin):
        return True

def main():
    application = tornado.web.Application([
        (r'/ws', SocketHandler),
    ])
    try:
        http_server = tornado.httpserver.HTTPServer(application)
        http_server.listen(65)
        tornado.ioloop.IOLoop.instance().start()
    except KeyboardInterrupt:
        print('Room chat closed!')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)

if __name__ == '__main__':
    main()
