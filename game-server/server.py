import pika, sys, os

def main():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
    channel = connection.channel()

    room = input('>>> Enter room number: ')
    channel.queue_declare(queue=room)

    def callback(ch, method, properties, body):
        print(body.decode())
        ch.basic_ack(delivery_tag = method.delivery_tag)

    channel.basic_consume(queue=room, on_message_callback=callback)

    print('Room {} chat has started! Waiting for messages'.format(room))
    channel.start_consuming()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Room chat closed!')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)