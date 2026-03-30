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
        message.success(`已选择 ${value.length} 道题目`);
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
