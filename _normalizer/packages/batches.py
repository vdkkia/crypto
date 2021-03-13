import redis
import os
import json

def load_batches_info(redis_uri):
  with redis.Redis.from_url(redis_uri) as redis_client:
    batches_info_str = redis_client.get('KEYWORD_BATCHES').decode('utf-8')
    batch_info = json.loads(batches_info_str)
  return batch_info