import pika, sys, os
import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web

clients = []

class SocketHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        print('WebSocket opened')
        clients.append(self)

    def on_message(self, message):
        print('Received:')
        self.write_message("Received: " + message)
        for w in clients:
            w.write_message('MASS MESSAGE')

    def on_close(self):
        print('WebSocket closed')
        clients.remove(self)

def main():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
    channel = connection.channel()

    room = input('>>> Enter room number: ')
    channel.queue_declare(queue=room)

    def callback(ch, method, properties, body):
        print(body.decode())
        ch.basic_ack(delivery_tag = method.delivery_tag)

    def consumer_callback(ch, method, properties, body):
        print("[x] Received %r" % (body,))
        # The messagge is brodcast to the connected clients
        for itm in clients:
            itm.write_message(body)

    channel.basic_consume(queue=room, on_message_callback=consumer_callback)

    socket = SocketHandler()
    socket.open()

    print('Room {} chat has started! Waiting for messages'.format(room))
    # channel.start_consuming()


# def consumer_callback(ch, method, properties, body):
#         print("[x] Received %r" % (body,))
#         # The messagge is brodcast to the connected clients
#         for itm in clients:
#             itm.write_message(body)

# def threaded_rmq():
#     channel.queue_declare(queue="my_queue")
#     print('consumer ready, on my_queue')
#     channel.basic_consume(consumer_callback, queue="my_queue", no_ack=True) 
#     channel.start_consuming()

application = tornado.web.Application([
  (r'/ws', SocketHandler),
])

if __name__ == '__main__':
    try:
        main()
        http_server = tornado.httpserver.HTTPServer(application)
        http_server.listen(65)
        tornado.ioloop.IOLoop.instance().start()
    except KeyboardInterrupt:
        print('Room chat closed!')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)