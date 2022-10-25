#!/usr/bin/env python

import pika
import logging

logging.basicConfig()

connection = pika.BlockingConnection()
print
'Connected:localhost'
channel = connection.channel()
channel.queue_declare(queue="0")
channel.basic_publish(exchange='',
                      routing_key='0',
                      body='Test Message')
connection.close()