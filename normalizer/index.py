import os
from confluent_kafka import Consumer

BROKER_HOST = os.environ.get("KAFKA_BROKER_HOST")
print(BROKER_HOST)
TOPIC = 'welcome'

running = True


def consume_messages(topic, consumer):
    print('consuming messages from topic "{0}":'.format(topic))
    try:
        consumer.subscribe([topic])
        while running:
            msg = consumer.poll(timeout=1.0)
            if msg is None:
                continue
            print(msg.value().decode('utf-8'))
    except:
        print('something went wrong')
    finally:
        consumer.close()


c = Consumer({
    'bootstrap.servers': BROKER_HOST,
    'group.id': 'consumer-1',
    'auto.offset.reset': 'earliest'
})


def shutdown():
    running = False


try:
    print('Hello')
    consume_messages(TOPIC, c)
except Exception as e:
    print("""
    ❌ Failed.
    
    👉 %s
  
    """
          % (e))
