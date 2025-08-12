### 组件属性

| 属性名                | 类型       | 默认值 | 说明                                                                    |
|--------------------|----------|-----|-----------------------------------------------------------------------|
| value              | Array    | []  | 已选条目列表，每个条目应包含唯一id属性                                                  |
| onChange           | Function | -   | 值变化时的回调函数，参数为新的value值                                                 |
| onAdd              | Function | -   | 添加新条目的回调函数，参数为包含fetchApi、value和onChange的对象                            |
| api                | Function | -   | 获取条目列表的API函数，用于加载可选条目数据                                               |
| options            | Array    | -   | 条目操作选项列表，用于ButtonGroup组件                                              |
| renderSelectedItem | Function | -   | 自定义渲染已选条目的函数，参数为条目数据和包含el、target、fetchApi、onChange的对象                 |
| renderItem         | Function | -   | 自定义渲染可选条目的函数，参数为条目数据和包含fetchApi、el的对象                                 |
| renderOptions      | Function | -   | 自定义渲染操作选项的函数，参数为条目数据和包含searchProps、setSearchProps、fetchApi、options的对象 |
| getSearchProps     | Function | -   | 获取搜索属性的函数，用于配置搜索功能                                                    |
| searchPlaceholder  | String   | -   | 搜索框占位文本，未设置时使用国际化文本                                                   |
| selectedTitle      | String   | -   | 自定义已选列表的标题，未设置时使用国际化文本                                                |
| listTitle          | String   | -   | 自定义可选列表的标题，未设置时使用国际化文本                                                |
| renderListTitle    | Function | -   | 自定义渲染列表标题的函数，参数为包含fetchApi、searchProps、setSearchProps的对象              |
| maxScrollerHeight  | Number   | 800 | 设置滚动区域的最大高度（单位：像素）                                                    |

### 国际化支持

组件内置中文和英文两种语言，默认使用中文。可通过createWithIntlProvider配置国际化。

| 语言 | 代码    |
|----|-------|
| 中文 | zh-CN |
| 英文 | en-US |

### 国际化文本键值

| 键名                | 中文     | 英文                   |
|-------------------|--------|----------------------|
| add               | 添加     | Add                  |
| selected          | 已选     | Selected             |
| list              | 列表     | List                 |
| searchPlaceholder | 请输入关键字 | Please input keyword |