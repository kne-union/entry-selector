import React, { useRef, useState } from 'react';
import zhCn from './locale/zh-CN';
import enUS from './locale/en-US';
import { ReactSortable } from 'react-sortablejs';
import { createWithIntlProvider, useIntl } from '@kne/react-intl';
import { MoreOutlined, HolderOutlined } from '@ant-design/icons';
import ButtonGroup from '@kne/button-group';
import useControllerValue from '@kne/use-control-value';
import { FetchScrollLoader } from '@kne/scroll-loader';
import classnames from 'classnames';
import SearchInput from '@kne/search-input';
import { Flex, Button, Row, Col, List, Empty, Checkbox } from 'antd';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import '@kne/button-group/dist/index.css';
import style from './style.module.scss';

const EntrySelector = createWithIntlProvider({
  defaultLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCn,
    'en-US': enUS
  },
  namespace: 'entry-selector'
})(({ onAdd, api, options, selectedTitle, listTitle, renderListTitle, renderSelectedItem, renderItem, renderOptions, getSearchProps, searchPlaceholder, maxScrollerHeight = 800, ...props }) => {
  const [value, onChange] = useControllerValue(props);
  const [searchProps, setSearchProps] = useState({});
  const { formatMessage } = useIntl();
  const ref = useRef(null);
  const selectedMappingRef = useRef(new Map());
  return (
    <Flex
      vertical
      gap={8}
      className={style['entry-selector']}
      style={{
        '--max-scroller-height': `${maxScrollerHeight}px`
      }}
    >
      {typeof onAdd === 'function' && (
        <Flex>
          <Button
            shape="round"
            size="small"
            type="primary"
            onClick={() => {
              onAdd({ fetchApi: ref.current, value, onChange });
            }}
          >
            {formatMessage({ id: 'add' })}
          </Button>
        </Flex>
      )}
      <FetchScrollLoader
        {...props}
        completeTips={null}
        searchProps={searchProps}
        getSearchProps={getSearchProps}
        api={api}
        ref={ref}
        className={style['list-scroll']}
        autoHide={false}
        render={({ fetchApi, children }) => {
          const { data } = fetchApi;
          const { pageData, totalCount } = Object.assign(
            {},
            {
              pageData: [],
              totalCount: 0
            },
            data
          );
          pageData.forEach(item => {
            selectedMappingRef.current.set(item.id, item);
          });
          const listMapping = selectedMappingRef.current;
          const currentList = (value || []).map(item => Object.assign({}, listMapping.get(item.id) || item));
          return (
            <Row gutter={[12, 12]}>
              <Col span={12}>
                <div className={style['list-outer']}>
                  {totalCount > 0 && <div className={style['list-header']}>{selectedTitle || formatMessage({ id: 'selected' })}</div>}
                  <SimpleBar className={style['list-scroll']} autoHide={false}>
                    {value && value.length > 0 ? (
                      <List className={style['list']} size="small">
                        <ReactSortable
                          filter=".ignore-elements"
                          dragClass={style['sortable-drag']}
                          ghostClass={style['sortable-ghost']}
                          forceFallback
                          animation={300}
                          delayOnTouchStart
                          delay={2}
                          list={currentList}
                          setList={list => {
                            onChange(value => {
                              const mapping = new Map((value || []).map(item => [item.id, item]));
                              return list.map(({ id }) => {
                                return mapping.get(id);
                              });
                            });
                          }}
                        >
                          {currentList.map((item, index) => {
                            const defaultItem = <span className={'list-item-title'}>{item.title}</span>;
                            const mapping = new Map((value || []).map(item => [item.id, item]));
                            return (
                              <List.Item key={item.id} className={classnames(style['columns-control-content-item'], style['is-drag'])}>
                                <HolderOutlined className={style['columns-control-content-item-icon']} />
                                <div className={style['list-index']}>{index + 1}</div>
                                <Flex vertical flex={1}>
                                  {typeof renderSelectedItem === 'function'
                                    ? renderSelectedItem(mapping.get(item.id), {
                                        el: defaultItem,
                                        target: item,
                                        fetchApi,
                                        searchProps,
                                        setSearchProps,
                                        onChange: item => {
                                          return onChange(value => {
                                            const newValue = (value || []).slice(0);
                                            const index = newValue.findIndex(({ id }) => id === item.id);
                                            const currentItem = newValue[index];
                                            if (index > -1) {
                                              newValue.splice(index, 1, Object.assign({}, typeof item === 'function' ? item(currentItem) : item));
                                            }
                                            return newValue;
                                          });
                                        }
                                      })
                                    : defaultItem}
                                </Flex>
                              </List.Item>
                            );
                          })}
                        </ReactSortable>
                      </List>
                    ) : (
                      <Flex className={style['list']} justify="center" align="center">
                        <Empty />
                      </Flex>
                    )}
                  </SimpleBar>
                </div>
              </Col>
              <Col span={12}>
                <div className={style['list-outer']}>
                  <Flex className={style['list-header']} justify="space-between">
                    <div className={style['list-header-title']}>
                      {listTitle ||
                        (typeof renderListTitle === 'function' &&
                          renderListTitle({
                            fetchApi,
                            searchProps,
                            setSearchProps
                          })) ||
                        formatMessage({ id: 'list' })}
                    </div>
                    <div>
                      {typeof getSearchProps === 'function' && (
                        <SearchInput
                          size="small"
                          placeholder={searchPlaceholder || formatMessage({ id: 'searchPlaceholder' })}
                          value={searchProps.searchText}
                          onSearch={value => {
                            setSearchProps(searchProps => Object.assign({}, searchProps, { searchText: value }));
                          }}
                        />
                      )}
                    </div>
                  </Flex>
                  {children}
                </div>
              </Col>
            </Row>
          );
        }}
      >
        {({ fetchApi, list }) => {
          return (
            <List
              className={classnames(style['list'], style['list-lib'])}
              size="small"
              dataSource={list}
              renderItem={item => {
                const defaultItem = <span className={'list-item-title'}>{item.title}</span>;
                const targetOptions =
                  typeof renderOptions === 'function'
                    ? renderOptions(item, {
                        searchProps,
                        setSearchProps,
                        fetchApi,
                        options
                      })
                    : options;
                return (
                  <List.Item
                    key={item.id}
                    onClick={() => {
                      onChange(value => {
                        const newValue = (value || []).slice(0);
                        const index = newValue.findIndex(({ id }) => id === item.id);
                        if (index > -1) {
                          newValue.splice(index, 1);
                        } else {
                          newValue.push({ id: item.id });
                        }

                        return newValue;
                      });
                    }}
                  >
                    <Checkbox checked={(value || []).findIndex(({ id }) => id === item.id) > -1} />
                    <Flex vertical flex={1}>
                      {typeof renderItem === 'function'
                        ? renderItem(item, {
                            fetchApi,
                            el: defaultItem,
                            searchProps,
                            setSearchProps
                          })
                        : defaultItem}
                    </Flex>
                    {targetOptions && (
                      <Flex
                        flex={'0 0 50px'}
                        onClick={e => {
                          e.stopPropagation();
                        }}
                      >
                        <ButtonGroup more={<Button type="link" icon={<MoreOutlined />} />} list={targetOptions} />
                      </Flex>
                    )}
                  </List.Item>
                );
              }}
            />
          );
        }}
      </FetchScrollLoader>
    </Flex>
  );
});

export default EntrySelector;
