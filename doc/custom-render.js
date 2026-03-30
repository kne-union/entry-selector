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
                  message.info(`已${checked ? '开启' : '关闭'} "${item.title}" 的优先级`);
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
              message.info(`查看特性：${item.title}`);
            }
          },
          {
            children: '编辑',
            onClick: () => {
              message.info(`编辑特性：${item.title}`);
            }
          }
        ];
      }}
      maxScrollerHeight={600}
    />
  );
};

render(<CustomRenderExample />);
