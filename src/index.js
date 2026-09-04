import React, { useRef, useState } from 'react';
import zhCn from './locale/zh-CN';
import enUS from './locale/en-US';
import { ReactSortable } from 'react-sortablejs';
import { createWithIntlProvider, useIntl } from '@kne/react-intl';
import { MoreOutlined, HolderOutlined, DeleteOutlined, ClearOutlined } from '@ant-design/icons';
import ButtonGroup, { ConfirmButton } from '@kne/button-group';
import useControllerValue from '@kne/use-control-value';
import { FetchScrollLoader } from '@kne/scroll-loader';
import { useIsMobile } from '@kne/responsive-utils';
import useResize from '@kne/use-resize';
import classnames from 'classnames';
import SearchInput from '@kne/search-input';
import { Flex, Button, List, Empty, Checkbox } from 'antd';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import '@kne/button-group/dist/index.css';
import style from './style.module.scss';

const RESIZE_OPTIONS = { time: 50, isDebounce: false };

/** 白卡容器：用 useResize 量剩余高度，给 SimpleBar 明确 px；header 变化时同步重算 */
const FillHeightScroll = ({ children, measure, header }) => {
  const scrollRef = useRef(null);
  const [height, setHeight] = useState();

  const syncHeight = el => {
    if (!measure || !el) {
      return;
    }
    const scrollEl = scrollRef.current;
    if (!scrollEl) {
      return;
    }
    let used = 0;
    Array.prototype.forEach.call(el.children, child => {
      if (child !== scrollEl) {
        used += child.getBoundingClientRect().height;
      }
    });
    const next = Math.max(0, Math.floor(el.clientHeight - used));
    setHeight(prev => (prev === next ? prev : next));
  };

  const outerRef = useResize(syncHeight, RESIZE_OPTIONS);
  const headerRef = useResize(el => {
    if (el && el.parentElement) {
      syncHeight(el.parentElement);
    }
  }, RESIZE_OPTIONS);

  return (
    <div ref={outerRef} className={style['list-outer']}>
      {header ? (
        <div ref={headerRef} className={style['list-header-slot']}>
          {header}
        </div>
      ) : null}
      <div ref={scrollRef} className={style['list-scroll']} style={measure && height != null ? { height } : undefined}>
        {children}
      </div>
    </div>
  );
};

const EntrySelector = createWithIntlProvider({
  defaultLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCn,
    'en-US': enUS
  },
  namespace: 'entry-selector'
})(({ className, onAdd, api, options, selectedTitle, listTitle, renderListTitle, renderSelectedItem, renderItem, renderOptions, getSearchProps, searchPlaceholder, height, maxScrollerHeight, showClearButton = true, ...props }) => {
  const [value, onChange] = useControllerValue(props);
  const [searchProps, setSearchProps] = useState({});
  const { formatMessage } = useIntl();
  const isMobile = useIsMobile();
  const ref = useRef(null);
  const selectedMappingRef = useRef(new Map());
  // 双列白卡统一高度：优先 height，兼容旧 maxScrollerHeight；未传则走 CSS 变量 / 默认值
  const containerHeight = height ?? maxScrollerHeight;
  const onSelected = item => {
    return onChange(value => {
      const newValue = (value || []).slice(0);
      const index = newValue.findIndex(({ id }) => id === item.id);
      if (index > -1) {
        newValue.splice(index, 1);
      } else {
        newValue.push(Object.assign({}, item));
      }

      return newValue;
    });
  };

  return (
    // 自建 kne-responsive 容器，保证 mobile-container 在组件宽度 <768 时生效（含 example 手机预览）
    <div className={style['root']}>
      <Flex
        vertical
        gap={isMobile ? 12 : 8}
        className={classnames(className, style['entry-selector'])}
        style={
          containerHeight != null
            ? {
                '--entry-selector-height': `${containerHeight}px`
              }
            : undefined
        }
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
          className={style['list-scroll-inner']}
          autoHide={false}
          useSimpleBar={!isMobile}
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
            const selectedListBody =
              value && value.length > 0 ? (
                <List className={style['list']} size="small">
                  <ReactSortable
                    filter=".sortable-ignore-elements"
                    handle=".sortable-drag-handle"
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
                      const removeOption = (
                        <ConfirmButton
                          color="danger"
                          variant="filled"
                          className={'list-item-remove-btn'}
                          icon={<DeleteOutlined />}
                          onClick={() => {
                            onSelected(item);
                          }}
                        />
                      );
                      const mapping = new Map((value || []).map(item => [item.id, item]));
                      return (
                        <List.Item key={item.id} className={classnames(style['columns-control-content-item'], style['is-drag'])}>
                          <HolderOutlined className={classnames('sortable-drag-handle', style['columns-control-content-item-icon'])} />
                          <div className={style['list-index']}>{index + 1}</div>
                          <Flex justify="space-between" gap={8} flex={1} className={style['list-item-content']}>
                            <Flex vertical flex={1}>
                              {typeof renderSelectedItem === 'function'
                                ? renderSelectedItem(mapping.get(item.id), {
                                    el: defaultItem,
                                    removeOptionEl: removeOption,
                                    target: item,
                                    fetchApi,
                                    searchProps,
                                    setSearchProps,
                                    onChange,
                                    onSelected,
                                    onReplace: targetItem => {
                                      return onChange(value => {
                                        const newValue = (value || []).slice(0);
                                        const index = newValue.findIndex(({ id }) => id === item.id);
                                        const currentItem = newValue[index];
                                        if (index > -1) {
                                          newValue.splice(index, 1, Object.assign({}, typeof targetItem === 'function' ? targetItem(currentItem) : targetItem));
                                        }
                                        return newValue;
                                      });
                                    }
                                  })
                                : defaultItem}
                            </Flex>
                            {removeOption}
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
              );
            const selectedHeader =
              totalCount > 0 ? (
                <Flex className={style['list-header']} justify="space-between" align="center">
                  <div className={style['list-header-title']}>{selectedTitle || formatMessage({ id: 'selected' })}</div>
                  {showClearButton && value && value.length > 0 && (
                    <Button
                      type="link"
                      size="small"
                      title={formatMessage({ id: 'clear' })}
                      icon={<ClearOutlined />}
                      onClick={() => {
                        onChange([]);
                      }}
                    />
                  )}
                </Flex>
              ) : null;
            const listHeader = (
              <Flex
                className={classnames(style['list-header'], {
                  [style['list-header-plain']]: listTitle != null
                })}
                vertical={isMobile}
                justify="space-between"
                gap={8}
                align={isMobile ? 'stretch' : 'center'}
              >
                <div className={style['list-header-content']}>
                  {(() => {
                    if (listTitle != null) {
                      return listTitle;
                    }
                    const defaultTitle = <div className={style['list-header-title']}>{formatMessage({ id: 'list' })}</div>;
                    if (typeof renderListTitle === 'function') {
                      return renderListTitle({
                        fetchApi,
                        defaultTitle,
                        searchProps,
                        setSearchProps
                      });
                    }
                    return defaultTitle;
                  })()}
                </div>
                {typeof getSearchProps === 'function' && (
                  <SearchInput
                    className={style['list-header-search']}
                    size="small"
                    placeholder={searchPlaceholder || formatMessage({ id: 'searchPlaceholder' })}
                    value={searchProps.searchText}
                    onSearch={value => {
                      setSearchProps(searchProps => Object.assign({}, searchProps, { searchText: value }));
                    }}
                  />
                )}
              </Flex>
            );
            return (
              <div className={style['columns']}>
                <div className={style['column']}>
                  <FillHeightScroll measure={!isMobile} header={selectedHeader}>
                    {isMobile ? (
                      selectedListBody
                    ) : (
                      <SimpleBar className={style['list-scroll-inner']} style={{ height: '100%' }} autoHide={false}>
                        {selectedListBody}
                      </SimpleBar>
                    )}
                  </FillHeightScroll>
                </div>
                <div className={style['column']}>
                  <FillHeightScroll measure={!isMobile} header={listHeader}>
                    {children}
                  </FillHeightScroll>
                </div>
              </div>
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
                        onSelected(item);
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
                          <ButtonGroup showLength={0} more={<Button type="link" icon={<MoreOutlined />} />} list={targetOptions} />
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
    </div>
  );
});

export default EntrySelector;
