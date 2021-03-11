import os
from confluent_kafka import Consumer, KafkaError

BROKER_HOST = os.environ.get("KAFKA_BROKER_HOST")
TOPIC = 'new-google-trends-plain-data'

running = True


def consume_messages(topic, consumer):
    print('consuming messages from topic "{0}":'.format(topic))
    try:
        consumer.subscribe([topic])
        while running:
            msg = consumer.poll(timeout=1.0)
            if msg is None:
                continue
            if msg.error():
              if msg.error().code() == KafkaError._PARTITION_EOF:
                continue
              else:
                print(msg.error())
                break
            print(msg.value().decode('utf-8'))
    except:
        print('something went wrong')
    finally:
        consumer.close()


c = Consumer({
    'bootstrap.servers': BROKER_HOST,
    'group.id': 'timeseries-normalizer',
    'auto.offset.reset': 'smallest'
})


def shutdown():
    running = False


try:
    consume_messages(TOPIC, c)
except Exception as e:
    print("""
    ❌ Failed.
    
    👉 %s
  
    """
          % (e))
