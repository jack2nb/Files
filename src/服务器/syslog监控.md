 



## 监控



###  ELK Stack

日志外发

rsyslog /logstash 使用的默认514端口收集日志

```
 vi docker-compose-elk.yml 
```

elasticsearch

```yml
# elasticsearch数据存储  kibana数据可视化  logstash数据收集
version: '3'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.10.0
    environment:
      - discovery.type=single-node

  logstash:
    image: docker.elastic.co/logstash/logstash:7.10.0
    ports:
      - "9601:9601"
      - "5044:5044"
      - "514:514/udp"

  kibana:
    image: docker.elastic.co/kibana/kibana:7.10.0
    ports:
      - "5601:5601"
```

```
docker compose  -f ./docker-compose-elk.yml   up -d
```

```
vi /usr/share/elasticsearch/config/elasticsearch.yml  #elasticsearch配置文件
```

```
vi /usr/share/kibana/config/kibana.yml  #kibana配置文件  #i18n.locale: "zh-CN"
```

## 在接受日志配置

```
vi /usr/share/logstash/pipeline/logstash.conf  # logstash配置文件
```

### 默认配置

```ruby
input {
    beats {
    port => 5044
  }
}
output {
    stdout { codec => rubydebug}
}
```



### 测试配置

```
vi  /tmp/syslog-pipeline.conf 
```

```ruby
input {
    syslog{
        type => "system-syslog"
        tags => "test"
        port => 514
    }
}
output {
    stdout { codec => rubydebug}
}
```

```
logstash -f /tmp/syslog-pipeline.conf  --path.data=/tmp/logstash
```



### 简易配置

```ruby
input {
    syslog{
        type => "system-syslog"
        port => 514
    }
}
output {
    elasticsearch {
        hosts => ["elasticsearch:9200"]
        index => "system-syslog-%{+YYYY-MM-dd}"
    }
}
```

在elasticsearch的管理->索引管理就会收到来之logstash日志

### 基于判断配置

```ruby
output {
    if [host] == "192.168.0.2"{
        elasticsearch {
            hosts => ["elasticsearch:9200"]
            index => "huawei-syslog-%{+YYYY-MM-dd}"
        }
    }
    if [host] == "192.168.0.121"{
        elasticsearch {
            hosts => ["elasticsearch:9200"]
            index => "test-syslog-%{+YYYY-MM-dd}"
        }
    }
    if [host] == "192.168.0.121"{
        elasticsearch {
            hosts => ["elasticsearch:9200"]
            index => "weboa-syslog-%{+YYYY-MM-dd}"
        }
    }
}
 
```

### 过滤转换

```ruby
filter {
  if [host] == "192.168.0.2" {
    grok{
      match => {"message" => "%{SYSLOGTIMESTAMP:time} %{DATA:hostname} %{GREEDYDATA:info}"}
    }
	date{
		match => ["timestamp","yyyy-MMM-dd HH:mm:ss Z"]
	}
  }
} 
```

```ruby
output {
  stdout {codec => rubydebug}
    if "hw" in [tags] {
      elasticsearch {
        hosts => ["elasticsearch:9200"]
        index => "tcshwnet-%{+YYYY-MM-dd}"
        manage_template => false
        sniffing => false
    }
  }
}
```

#### ip解析库

```
/usr/share/logstash/vendor/bundle/jruby/2.5.0/gems/logstash-filter-geoip-6.0.3-java/vendor/GeoLite2-City.mmdb
/usr/share/logstash/vendor/bundle/jruby/2.5.0/gems/logstash-filter-geoip-6.0.3-java/vendor/GeoLite2-ASN.mmdb
```



### 抓包验证数据

监听查看

```
sudo netstat -anlup|grep 514
```

发送日志

```
logger -n  192.168.0.123 asdfasdasfasdfsad
```

抓包验证

```
tcpdump -v -nn -i eno1   port 514 and udp
```

```
 Msg: Jan 23 2008 13:27:53 3700 %%01SHELL/6/DISPLAY_CMDRECORD(l)[21]:Record command information. (Task=VT0 , Ip=192.168.20.199, User=admin, Command="d| include info-center")
```

#### 解析后的数据

```
 Msg: 1 2024-03-27T08:09:42.417757+08:00 vm jack - - [timeQuality tzKnown="1" isSynced="1" syncAccuracy="223000"] asdfasdasfasdfsad
```



```ruby
{
          "priority" => 0,
          "@version" => "1",
              "host" => "192.168.0.121",
              "type" => "system-syslog",
              "tags" => [
        [0] "123",
        [1] "_grokparsefailure_sysloginput"
    ],
    "facility_label" => "kernel",
          "facility" => 0,
    "severity_label" => "Emergency",
        "@timestamp" => 2024-03-27T02:05:50.078Z,
          "severity" => 0,
           "message" => "<13>1 2024-03-27T10:05:50.040097+08:00 vm jack - - [timeQuality tzKnown=\"1\" isSynced=\"1\" syncAccuracy=\"634500\"] asdfasdasfasdfsad"
}
```

### Nginx日志接入

```
access_log syslog:server=192.168.0.123:514,facility=weboa,tag=nginx_access_log,severity=info;
error_log syslog:server=192.168.0.123:514,facility=weboa,tag=nginx_error_log,severity=info;
```

识别设备标签 facility_label 通过这个判断  或  识别标签program

```
{
        "@timestamp" => 2024-03-27T03:12:58.000Z,
         "timestamp" => "Mar 27 03:12:58",
              "type" => "system-syslog",
          "priority" => 190,
    "facility_label" => "local7",
         "logsource" => "c33462a7dc5e",
              "host" => "192.168.0.121",
          "@version" => "1",
           "program" => "nginx_access_log",
    "severity_label" => "Informational",
          "facility" => 23,
           "message" => "123.6.49.18 - - [27/Mar/2024:03:12:58 +0000] \"GET /K3Cloud/html5/script/thirdpart/kendo/messages/kendo.messages.zh-CN.min.js?ver=8.1.410.13 HTTP/1.1\" 200 14710 \"http://oa.ouqiyj.com:8099/K3Cloud\" \"Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Mobile Safari/537.36\"",
          "severity" => 6
}
```



