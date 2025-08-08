
# entry-selector


### 描述

EntrySelector是一个用于选择和管理条目列表的 React 组件。它提供了一个直观的界面，允许用户从可选列表中选择条目，并对已选条目进行管理，包括排序、搜索和删除等操作。


### 安装

```shell
npm i --save @kne/entry-selector
```


### 概述

EntrySelector 是一个用于选择和管理条目列表的 React 组件。它提供了一个直观的界面，允许用户从可选列表中选择条目，并对已选条目进行管理，包括排序、搜索和删除等操作。

#### 主要功能

- **双列表展示**：清晰地分离已选条目和可选条目
- **拖拽排序**：支持对已选条目进行拖拽排序
- **搜索过滤**：可以通过关键词搜索过滤条目
- **自定义渲染**：支持自定义条目的渲染方式
- **国际化支持**：内置中文和英文语言支持
- **添加新条目**：支持添加不在预设列表中的新条目

#### 使用场景

EntrySelector 适用于需要从预定义列表中选择多个条目并进行排序的场景，例如：

- 选择并排序文章分类
- 管理产品标签
- 配置用户权限
- 选择并排序展示项目

#### 基本原理

组件内部维护已选条目列表和可选条目列表两个状态，通过用户交互在这两个列表之间移动条目。组件使用 react-sortablejs 实现拖拽排序功能，并支持通过搜索框过滤条目列表。


### 示例


#### 示例样式

```scss
.ant-card {
  border-color: black;
  text-align: center;
  width: 200px;
}
```

#### 示例代码

- 这里填写示例标题
- 这里填写示例说明
- _EntrySelector(@kne/current-lib_entry-selector)[import * as _EntrySelector from "@kne/entry-selector"],(@kne/current-lib_entry-selector/dist/index.css),antd(antd)

```jsx
const { default: EntrySelector } = _EntrySelector;
const { Switch, Flex } = antd;

const BaseExample = () => {
  return (
    <div>
      <EntrySelector
        pagination={{ paramsType: 'params' }}
        api={{
          loader: data => {
            console.log('fetch props:', data);
            return {
              totalCount: 3,
              pageData: [
                {
                  id: 1,
                  title: '你是什么性格的人？有哪些方面的不足？需要怎样改进？'
                },
                {
                  id: 2,
                  title: '你认为如何可以让一个员工有效高质的完成他的工作？'
                },
                {
                  id: 3,
                  title: '请分享一次你快速作出决定的经验，当时的情况怎样？你是怎么处理的？'
                }
              ]
            };
          }
        }}
        getSearchProps={({ searchText }) => {
          return { title: searchText };
        }}
        renderSelectedItem={(item, { el, onChange }) => {
          return (
            <>
              {el}
              <Flex align="center" gap={8}>
                <span>开启追问</span>
                <Switch
                  size="small"
                  checked={item.hasProbe}
                  onChange={checked => {
                    onChange(Object.assign({}, item, { hasProbe: checked }));
                  }}
                />
              </Flex>
            </>
          );
        }}
        onChange={value => {
          console.log('>>>>>>>>', value);
        }}
        options={[
          {
            children: '操作1'
          },
          {
            children: '操作2'
          }
        ]}
      />
    </div>
  );
};

render(<BaseExample />);

```


### API

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| value | Array | [] | 已选条目列表，每个条目应包含唯一id属性 |
| onChange | Function | - | 值变化时的回调函数，参数为新的value值 |
| onAdd | Function | - | 添加新条目的回调函数，参数为包含fetchApi、value和onChange的对象 |
| api | Function | - | 获取条目列表的API函数，用于加载可选条目数据 |
| options | Array | - | 条目操作选项列表，用于ButtonGroup组件 |
| renderSelectedItem | Function | - | 自定义渲染已选条目的函数，参数为条目数据和包含el、target、fetchApi、onChange的对象 |
| renderItem | Function | - | 自定义渲染可选条目的函数，参数为条目数据和包含fetchApi、el的对象 |
| renderOptions | Function | - | 自定义渲染操作选项的函数，参数为包含fetchApi、options的对象 |
| getSearchProps | Function | - | 获取搜索属性的函数，用于配置搜索功能 |
| searchPlaceholder | String | - | 搜索框占位文本，未设置时使用国际化文本 |

#### 国际化支持

组件内置中文和英文两种语言，默认使用中文。可通过createWithIntlProvider配置国际化。

| 语言 | 代码 |
|------|------|
| 中文 | zh-CN |
| 英文 | en-US |

#### 国际化文本键值

| 键名 | 中文 | 英文 |
|------|------|------|
| add | 添加 | Add |
| selected | 已选 | Selected |
| list | 列表 | List |
| searchPlaceholder | 请输入关键字 | Please input keyword |

