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
| listTitle          | ReactNode | -   | 自定义可选列表标题区域，可直接传入 Filter 等组件；传入后不再显示默认「列表」文案 |
| renderListTitle    | Function | -   | 自定义渲染列表标题；参数含 fetchApi、defaultTitle、searchProps、setSearchProps；可不渲染 defaultTitle |
| height             | Number   | 800 | 双列白色卡片统一高度（px）；写入 `--entry-selector-height`。title 增高时滚动区变矮，两侧始终同高铺满 |
| maxScrollerHeight  | Number   | -   | 兼容旧名，等同 `height`；优先使用 `height` |
| showClearButton    | Boolean  | true | 是否显示清空按钮，默认显示                                                       |
| showSelected       | Boolean  | true | 是否显示已选列；`false` 时只渲染可选列表（如外层自建已选区） |
| showList           | Boolean  | true | 是否显示可选列表列；`false` 时只渲染已选列 |
| columnsOrder       | String   | selected-first | 列顺序：`selected-first`（已选在左）或 `list-first`（列表在左） |

也可在外层通过 CSS 变量设置（未传 `height` / `maxScrollerHeight` 时生效）：

```css
.my-wrap {
  --entry-selector-height: 500px;
}
```

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
| clear             | 清空     | Clear                |