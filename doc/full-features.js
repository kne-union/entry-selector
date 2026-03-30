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
      message.success(`已添加技能：${values.title}`);
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
              message.success(`已收藏技能：${item.title}`);
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
