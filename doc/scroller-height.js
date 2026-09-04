const { default: EntrySelector } = _EntrySelector;
const { useState } = React;
const { Flex, Tag, Button, Typography, message } = antd;

const { Text } = Typography;

/**
 * 统一容器高度：height / --entry-selector-height 作用于双列白卡整体（默认含标题），
 * title 展开时滚动区变矮，两侧白卡始终同高且铺满。
 */
const mockInterviewQuestions = Array.from({ length: 20 }, (_, i) => {
  const id = i + 1;
  return {
    id,
    title: `面试题目 ${id}：请结合经历说明你的核心优势。`,
    type: i % 2 === 0 ? '视频' : '单选',
    tags: ['学习能力', '自我介绍', '英语水平', '逻辑'][i % 4]
  };
});

const ExpandableListTitle = ({ expanded, onToggle }) => {
  return (
    <Flex vertical gap={8} style={{ width: '100%' }}>
      <Flex justify="space-between" align="center" gap={8}>
        <Text strong>题目库</Text>
        <Button type="link" size="small" onClick={onToggle}>
          {expanded ? '收起标签' : '展开标签'}
        </Button>
      </Flex>
      {expanded ? (
        <Flex
          vertical
          gap={8}
          style={{
            padding: 12,
            background: '#f5f5f5',
            borderRadius: 8
          }}
        >
          <Text type="secondary" style={{ fontSize: 12 }}>
            模拟关联题库 title 区展开后的额外高度（技能标签 / 筛选摘要）
          </Text>
          <Flex gap={8} wrap="wrap">
            {['学习能力 1题', '自我介绍 1题', '兴趣爱好 1题', '逻辑 1题', '英语水平 1题', '硬技能 2题'].map(label => (
              <Tag key={label} color="processing">
                {label}
              </Tag>
            ))}
          </Flex>
          <Flex gap={8} wrap="wrap">
            {['准备时间汇总', '答题时长分布', '数字人覆盖情况'].map(label => (
              <Tag key={label}>{label}</Tag>
            ))}
          </Flex>
        </Flex>
      ) : null}
    </Flex>
  );
};

const ScrollerHeightExample = () => {
  const [selectedQuestions, setSelectedQuestions] = useState(mockInterviewQuestions.slice(0, 2));
  const [titleExpanded, setTitleExpanded] = useState(false);

  return (
    <Flex vertical gap={12}>
      <Text type="secondary">
        <Text code>height={500}</Text>
        （或 CSS 变量 <Text code>--entry-selector-height</Text>
        ）为双列白卡统一高度。点「展开标签」：两侧白卡仍同高 500px，右侧 title 变高、滚动区变矮，内部滚动正常。
      </Text>
      <EntrySelector
        value={selectedQuestions}
        onChange={value => {
          setSelectedQuestions(value);
          message.success(`已选择 ${value.length} 道题目`);
        }}
        pagination={{ paramsType: 'params' }}
        height={500}
        api={{
          loader: async ({ params }) => {
            await new Promise(resolve => setTimeout(resolve, 200));
            const { title } = params || {};
            let filteredData = mockInterviewQuestions;
            if (title) {
              filteredData = filteredData.filter(item => item.title.includes(title) || item.tags.includes(title));
            }
            return {
              totalCount: filteredData.length,
              pageData: filteredData
            };
          }
        }}
        getSearchProps={({ searchText }) => ({ title: searchText })}
        searchPlaceholder="搜索题目"
        selectedTitle="已选择"
        listTitle={<ExpandableListTitle expanded={titleExpanded} onToggle={() => setTitleExpanded(v => !v)} />}
        renderItem={(item, { el }) => (
          <Flex vertical gap={4}>
            {el}
            <Flex gap={6}>
              <Tag>{item.type}</Tag>
              <Tag>{item.tags}</Tag>
            </Flex>
          </Flex>
        )}
      />
    </Flex>
  );
};

render(<ScrollerHeightExample />);
