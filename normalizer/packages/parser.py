import json
import pandas as pd


def parse_input_data(input_str , separator = '___SEP___'):
    parts = input_str.split(separator)
    batch_index = int(parts[0][1:])
    timeline_info = json.loads(parts[1])['default']
    return {
        'batch_index': batch_index,
        'timeline': timeline_info['timelineData'],
        'averages': timeline_info['averages']
    }


def convert_to_dataframe(google_trends_data, batches):
    timeseries_data = []
    batch = batches[google_trends_data['batch_index']]
    for data_point in google_trends_data['timeline']:
        timeseries_item = {
            'timestamp': pd.to_datetime(data_point['formattedTime']),
        }
        for index, keyword_info in enumerate(batch):
            timeseries_item[keyword_info['term']] = data_point['value'][index]
        timeseries_item['formattedValues'] = '-'.join(data_point['formattedValue'])
        timeseries_item['hasData'] = '-'.join(['Y' if has_data else 'N' for has_data in data_point['hasData']])
        timeseries_item['formattedTime'] = data_point['formattedTime']
        timeseries_item['formattedAxisTime'] = data_point['formattedAxisTime']
        timeseries_item['time'] = data_point['time']
        timeseries_data.append(timeseries_item)
    data_frame = pd.DataFrame(timeseries_data)
    data_frame = data_frame.set_index('timestamp')
    return data_frame