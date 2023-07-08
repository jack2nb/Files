# 一图胜千言

### 进度图(甘特)

 



```mermaid
gantt
    title 工作计划
    dateFormat  YYYY-MM-DD
section 开发
    登入功能           :a1, 2020-01-01, 30d
    数据查询功能     :after a1  , 20d
section 测试
    界面测试      :2020-01-12  , 12d
    联调api      : 24d
```

### 并行流

```mermaid
flowchart LR

a-->|开始|B;
a-->|开始|C;

subgraph B和C同时进行
B-->|步骤|D1;
C-->|步骤2|D2;
end

```

### 流程图





```mermaid
flowchart LR
A --> B
C -.箭头虚线.-> D
E -.->|箭头虚线| F



A --- B --文字--> C -.- D -.文字.- E === F ==文字==> G
```

```mermaid
graph TB;
A & B --> C & D
```

#### 流程图（mermaid）
```mermaid
flowchart LR
    id1(Start)-->id2(Stop)
    style id1 fill:#f9f, stroke:#333, stroke-width:4px
    style id2 fill:#bbf, stroke:#f66, stroke-width:2px, color:#fff, stroke-dasharray: 5 5
```

```mermaid
%% graph TD; comment
graph LR
Zero
A(This is A)
B[This is B]
C([This is C])
D[[This is D]]
E[(Database E)]
F((This is F))
G>This is G]
H{This is H}
I{{This is I}}
J[/J/]
K[\K\]
L[/L\]
M[\ M/]

Zero --> A --> B --> C --> D --> E --> F --> G --> H --> I --> J --> K --> L --> M
```

```mermaid
flowchart LR
%% this is a comment A -- text --> B{node}
   A -- text --> B -- text2 --> C

```






### 饼图

```mermaid
pie
    title 工作时间安排
    "网络优化" : 42.96
    "erp报表梳理" : 50.05
    "OA办公流程整理" : 10.01
    "服务器监控" :  5
```

------------------

<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mermaid/9.4.3/mermaid.min.js"></script>
<script>
console.log('显示图表') 
mermaid.init({ noteMargin: 10 }, '.language-mermaid');
</script>


​        


# 视频

<!-- webm格式 -->

<video id="video" controls=""  >
      <source id="webm" src="https://files.i1314.top/manim-ce.mp4" type="video/webm">
<ideos>