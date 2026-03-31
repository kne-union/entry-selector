# entry-selector

### 描述

EntrySelector是一个用于选择和管理条目列表的 React 组件。它提供了一个直观的界面，允许用户从可选列表中选择条目，并对已选条目进行管理，包括排序、搜索和删除等操作。

### 安装

```shell
npm i --save @kne/entry-selector
```

### 概述

EntrySelector 是一个用于选择和管理条目列表的 React 组件。它提供了一个直观的界面，允许用户从可选列表中选择条目，并对已选条目进行管理，包括排序、搜索和删除等操作。

### 主要功能

- **双列表展示**：清晰地分离已选条目和可选条目
- **拖拽排序**：支持对已选条目进行拖拽排序
- **搜索过滤**：可以通过关键词搜索过滤条目
- **自定义渲染**：支持自定义条目的渲染方式
- **国际化支持**：内置中文和英文语言支持
- **添加新条目**：支持添加不在预设列表中的新条目

### 使用场景

EntrySelector 适用于需要从预定义列表中选择多个条目并进行排序的场景，例如：

- 选择并排序文章分类
- 管理产品标签
- 配置用户权限
- 选择并排序展示项目

### 基本原理

组件内部维护已选条目列表和可选条目列表两个状态，通过用户交互在这两个列表之间移动条目。组件使用 react-sortablejs
实现拖拽排序功能，并支持通过搜索框过滤条目列表。


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

- 基础用法
- 展示EntrySelector组件的基本使用，包括条目选择、搜索过滤和拖拽排序功能
- _EntrySelector(@kne/current-lib_entry-selector)[import * as _EntrySelector from "@kne/entry-selector"],(@kne/current-lib_entry-selector/dist/index.css),antd(antd)

```jsx
const { default: EntrySelector } = _EntrySelector;
const { useState } = React;
const { message } = antd;

// 模拟面试题库数据
const mockQuestionDatabase = [
  { id: 1, title: '请简单介绍一下你自己', category: '个人介绍', difficulty: '简单' },
  { id: 2, title: '你认为自己最大的优点和缺点是什么？', category: '性格分析', difficulty: '简单' },
  { id: 3, title: '请描述一次你成功解决团队冲突的经历', category: '团队协作', difficulty: '中等' },
  { id: 4, title: '你如何处理工作中的高压情况？请举例说明', category: '压力管理', difficulty: '中等' },
  { id: 5, title: '请分享一次你快速作出决策的经验', category: '决策能力', difficulty: '中等' },
  { id: 6, title: '你如何看待加班？如何平衡工作与生活？', category: '工作态度', difficulty: '简单' },
  { id: 7, title: '描述一次你主动承担责任并超出预期的项目', category: '主动性', difficulty: '困难' },
  { id: 8, title: '你如何让团队成员有效高质完成工作？', category: '团队管理', difficulty: '困难' }
];

const BaseExample = () => {
  const [selectedQuestions, setSelectedQuestions] = useState([
    { id: 1, title: '请简单介绍一下你自己' }
  ]);

  return (
    <EntrySelector
      value={selectedQuestions}
      onChange={value => {
        setSelectedQuestions(value);
        message.success(&#96;已选择 ${value.length} 道题目&#96;);
      }}
      pagination={{ paramsType: 'params' }}
      api={{
        loader: async ({ params }) => {
          // 模拟API请求延迟
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const { title } = params || {};
          let filteredData = mockQuestionDatabase;
          
          // 根据搜索关键词过滤
          if (title) {
            filteredData = filteredData.filter(
              item => item.title.includes(title) || item.category.includes(title)
            );
          }
          
          return {
            totalCount: filteredData.length,
            pageData: filteredData
          };
        }
      }}
      getSearchProps={({ searchText }) => {
        return { title: searchText };
      }}
      searchPlaceholder="搜索题目或分类"
      selectedTitle="已选题目（可拖拽排序）"
      listTitle="题目库"
      maxScrollerHeight={600}
    />
  );
};

render(<BaseExample />);

```

- 自定义渲染
- 展示如何自定义渲染已选条目和可选条目，实现更丰富的交互功能
- _EntrySelector(@kne/current-lib_entry-selector)[import * as _EntrySelector from "@kne/entry-selector"],(@kne/current-lib_entry-selector/dist/index.css),antd(antd)

```jsx
const { default: EntrySelector } = _EntrySelector;
const { useState } = React;
const { Tag, Switch, Flex, message } = antd;

// 模拟产品特性数据
const mockFeatures = [
  { id: 1, title: '用户注册登录', status: '已完成', priority: 'high', category: '基础功能' },
  { id: 2, title: '商品搜索与筛选', status: '开发中', priority: 'high', category: '核心功能' },
  { id: 3, title: '购物车功能', status: '已完成', priority: 'high', category: '核心功能' },
  { id: 4, title: '订单管理', status: '待开发', priority: 'medium', category: '核心功能' },
  { id: 5, title: '支付集成', status: '待开发', priority: 'high', category: '核心功能' },
  { id: 6, title: '用户评价系统', status: '开发中', priority: 'medium', category: '增值功能' },
  { id: 7, title: '数据统计面板', status: '待开发', priority: 'low', category: '增值功能' },
  { id: 8, title: '消息推送', status: '已完成', priority: 'medium', category: '增值功能' }
];

const priorityColors = {
  high: 'red',
  medium: 'orange',
  low: 'blue'
};

const statusColors = {
  '已完成': 'green',
  '开发中': 'blue',
  '待开发': 'default'
};

const CustomRenderExample = () => {
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  return (
    <EntrySelector
      value={selectedFeatures}
      onChange={setSelectedFeatures}
      pagination={{ paramsType: 'params' }}
      api={{
        loader: async ({ params }) => {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const { title } = params || {};
          let filteredData = mockFeatures;
          
          if (title) {
            filteredData = filteredData.filter(
              item => item.title.includes(title) || item.category.includes(title)
            );
          }
          
          return {
            totalCount: filteredData.length,
            pageData: filteredData
          };
        }
      }}
      getSearchProps={({ searchText }) => ({ title: searchText })}
      searchPlaceholder="搜索特性名称或分类"
      selectedTitle="已选特性（需排期开发）"
      // 自定义渲染已选条目：展示优先级开关
      renderSelectedItem={(item, { el, onReplace }) => {
        return (
          <Flex vertical gap={4} style={{ width: '100%' }}>
            {el}
            <Flex align="center" gap={8}>
              <span style={{ fontSize: '12px' }}>高优先级</span>
              <Switch
                size="small"
                checked={item.isPriority}
                onChange={checked => {
                  onReplace({ ...item, isPriority: checked });
                  message.info(&#96;已${checked ? '开启' : '关闭'} "${item.title}" 的优先级&#96;);
                }}
              />
            </Flex>
          </Flex>
        );
      }}
      // 自定义渲染可选条目：展示标签和状态
      renderItem={(item, { el }) => {
        return (
          <Flex vertical gap={4}>
            {el}
            <Flex gap={4}>
              <Tag color={statusColors[item.status]} style={{ margin: 0 }}>
                {item.status}
              </Tag>
              <Tag color={priorityColors[item.priority]} style={{ margin: 0 }}>
                {item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低'}
              </Tag>
              <Tag color="purple" style={{ margin: 0 }}>
                {item.category}
              </Tag>
            </Flex>
          </Flex>
        );
      }}
      // 自定义渲染操作选项
      renderOptions={(item, { fetchApi }) => {
        return [
          {
            children: '查看详情',
            onClick: () => {
              message.info(&#96;查看特性：${item.title}&#96;);
            }
          },
          {
            children: '编辑',
            onClick: () => {
              message.info(&#96;编辑特性：${item.title}&#96;);
            }
          }
        ];
      }}
      maxScrollerHeight={600}
    />
  );
};

render(<CustomRenderExample />);

```

- 完整功能
- 展示EntrySelector的完整功能，包括添加新条目、操作选项、自定义标题等
- _EntrySelector(@kne/current-lib_entry-selector)[import * as _EntrySelector from "@kne/entry-selector"],(@kne/current-lib_entry-selector/dist/index.css),antd(antd),remoteLoader(@kne/remote-loader)

```jsx
const { default: EntrySelector } = _EntrySelector;
const { createWithRemoteLoader } = remoteLoader;
const { useState } = React;
const { Button, Modal, Form, Input, Select, message, Tag, Flex } = antd;

// 模拟候选人技能数据
const mockSkillsDatabase = [
  { id: 1, title: 'JavaScript', level: 'advanced', category: '前端开发' },
  { id: 2, title: 'TypeScript', level: 'advanced', category: '前端开发' },
  { id: 3, title: 'React', level: 'advanced', category: '前端框架' },
  { id: 4, title: 'Vue.js', level: 'intermediate', category: '前端框架' },
  { id: 5, title: 'Node.js', level: 'advanced', category: '后端开发' },
  { id: 6, title: 'Python', level: 'intermediate', category: '后端开发' },
  { id: 7, title: 'MySQL', level: 'advanced', category: '数据库' },
  { id: 8, title: 'MongoDB', level: 'intermediate', category: '数据库' },
  { id: 9, title: 'Docker', level: 'intermediate', category: '运维工具' },
  { id: 10, title: 'Git', level: 'advanced', category: '版本控制' }
];

const levelColors = {
  advanced: 'green',
  intermediate: 'blue',
  beginner: 'orange'
};

const levelLabels = {
  advanced: '精通',
  intermediate: '熟练',
  beginner: '了解'
};

const FullFeaturesExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 处理添加新技能
  const handleAdd = ({ fetchApi, onChange }) => {
    setModalVisible(true);
  };

  // 提交新技能
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const newSkill = {
        id: Date.now(),
        ...values,
        isNew: true
      };
      onChange(prev => [...prev, newSkill]);
      message.success(&#96;已添加技能：${values.title}&#96;);
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <PureGlobal
      preset={{
        ajax: async api => {
          return { data: { code: 0, data: api.loader() } };
        }
      }}
    >
      <EntrySelector
        value={selectedSkills}
        onChange={setSelectedSkills}
        // 添加新条目功能
        onAdd={handleAdd}
        // API配置
        pagination={{ paramsType: 'params' }}
        api={{
          loader: async ({ params }) => {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const { title } = params || {};
            let filteredData = mockSkillsDatabase;
            
            if (title) {
              filteredData = filteredData.filter(
                item => item.title.toLowerCase().includes(title.toLowerCase()) || 
                       item.category.includes(title)
              );
            }
            
            return {
              totalCount: filteredData.length,
              pageData: filteredData
            };
          }
        }}
        // 搜索配置
        getSearchProps={({ searchText }) => ({ title: searchText })}
        searchPlaceholder="搜索技能名称或分类"
        // 自定义标题
        selectedTitle="候选人技能清单（可拖拽调整顺序）"
        renderListTitle={({ fetchApi, searchProps, setSearchProps }) => (
          <Flex justify="space-between" align="center" style={{ width: '100%' }}>
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
              技能库 ({fetchApi.data?.totalCount || 0} 项)
            </span>
          </Flex>
        )}
        // 自定义渲染已选条目
        renderSelectedItem={(item, { el, onReplace }) => (
          <Flex vertical gap={4} style={{ width: '100%' }}>
            {el}
            {item.isNew && <Tag color="cyan" style={{ margin: 0 }}>新增</Tag>}
          </Flex>
        )}
        // 自定义渲染可选条目
        renderItem={(item, { el }) => (
          <Flex vertical gap={4}>
            {el}
            <Flex gap={4}>
              <Tag color={levelColors[item.level]} style={{ margin: 0 }}>
                {levelLabels[item.level]}
              </Tag>
              <Tag color="purple" style={{ margin: 0 }}>
                {item.category}
              </Tag>
            </Flex>
          </Flex>
        )}
        // 操作选项
        options={[
          {
            children: '查看详情',
            onClick: (e, item) => {
              Modal.info({
                title: item.title,
                content: (
                  <div>
                    <p>技能等级：{levelLabels[item.level]}</p>
                    <p>所属分类：{item.category}</p>
                  </div>
                )
              });
            }
          },
          {
            children: '添加到收藏',
            onClick: (e, item) => {
              message.success(&#96;已收藏技能：${item.title}&#96;);
            }
          }
        ]}
        maxScrollerHeight={600}
      />

      {/* 添加新技能的弹窗 */}
      <Modal
        title="添加新技能"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="技能名称"
            name="title"
            rules={[{ required: true, message: '请输入技能名称' }]}
          >
            <Input placeholder="例如：GraphQL" />
          </Form.Item>
          <Form.Item
            label="熟练程度"
            name="level"
            rules={[{ required: true, message: '请选择熟练程度' }]}
          >
            <Select placeholder="请选择">
              <Select.Option value="beginner">了解</Select.Option>
              <Select.Option value="intermediate">熟练</Select.Option>
              <Select.Option value="advanced">精通</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="所属分类"
            name="category"
            rules={[{ required: true, message: '请输入所属分类' }]}
          >
            <Input placeholder="例如：前端开发、后端开发" />
          </Form.Item>
        </Form>
      </Modal>
    </PureGlobal>
  );
});

render(<FullFeaturesExample />);

```

### API

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
| showClearButton    | Boolean  | true | 是否显示清空按钮，默认显示                                                       |

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