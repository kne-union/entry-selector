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
