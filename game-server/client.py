import pika
from datetime import datetime, timezone
import pytz

def main():
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
        channel = connection.channel()
        tz = pytz.timezone('America/Sao_Paulo')

        room = input('>>> Enter room number: ')
        user = input('>>> Enter username: ')

        channel.queue_declare(queue=room)

        channel.basic_publish(exchange='',
                                routing_key=room,
                                body='{} joined the room!'.format(user))


        msg = ''
        while msg != 'x':
            msg = input('>>> ')
            channel.basic_publish(exchange='',
                                routing_key=room,
                                body='{} {}: {}'.format(datetime.now(tz).strftime("%H:%M"), user, msg))
    except KeyboardInterrupt:
        channel.basic_publish(exchange='',
                        routing_key=room,
                        body='{} left the room'.format(user))
        connection.close()

main()