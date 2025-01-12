import { timeRanges, dataSources, geoRegions } from './constants.js';
import { categoryData } from './category.js';

// 从storage恢复时，同步更新搜索框的值
function syncGeoSearchInput() {
    const geoSearchInput = document.getElementById('geoSearch');
    const clearGeoBtn = document.getElementById('clearGeo');
    const selectedRegion = geoRegions.find(region => region.id === document.getElementById('geoRegion').value);
    if (selectedRegion) {
        geoSearchInput.value = selectedRegion.name;
        clearGeoBtn.classList.add('visible');
    } else {
        geoSearchInput.value = '';
        clearGeoBtn.classList.remove('visible');
    }
}

// 转换数据结构
function transformData(node, parentPath = '') {
    const currentPath = parentPath ? `${parentPath}/${node.id}` : `${node.id}`;
    return {
        id: node.id,
        path: currentPath,
        name: node.name,
        children: node.children ? node.children.map(child => transformData(child, currentPath)) : []
    }
}

// 保存状态到 storage
async function saveState() {
    const state = {
        timeRange: document.getElementById('timeRange').value,
        dataSource: document.getElementById('dataSource').value,
        geoRegion: document.getElementById('geoRegion').value,
        keyword: document.getElementById('keyword').value,
        selectedCategories: [],
        expandedNodes: [],
        currentIndex: currentIndex, // 保存当前索引
        pendingCategories: pendingCategories // 保存待打开的分类列表
    };
    // 遍历所有checkbox，收集选中状态
    const processNode = (node) => {
        const content = node.querySelector('.node-content');
        if (!content) return;

        const checkbox = content.querySelector('input[type="checkbox"]');
        const expander = content.querySelector('.expander');
        
        if (checkbox?.checked) {
            state.selectedCategories.push(checkbox.dataset.path);
        }
        
        if (expander?.textContent === '-') {
            state.expandedNodes.push(checkbox.dataset.path);
        }

        // 处理子节点
        const children = node.querySelector('.children');
        if (children) {
            children.querySelectorAll(':scope > .tree-node').forEach(processNode);
        }
    };

    // 从根节点开始处理
    const rootNode = document.querySelector('#categoryTree');
    if (rootNode) {
        processNode(rootNode);
    }

    await chrome.storage.local.set({ trendsState: state });
}

// 存储待打开的分类列表和当前索引
let pendingCategories = [];
let currentIndex = 0;

// 从 storage 恢复状态
async function restoreState() {
    const { trendsState } = await chrome.storage.local.get('trendsState');
    if (!trendsState) return;
    // alert(JSON.stringify(trendsState))
    // 恢复选项值
    if (trendsState.timeRange) {
        document.getElementById('timeRange').value = trendsState.timeRange;
        previousTimeRange = trendsState.timeRange; // 恢复之前的时间范围
    }
    if (trendsState.dataSource) {
        document.getElementById('dataSource').value = trendsState.dataSource;
        previousDataSource = trendsState.dataSource; // 恢复之前的数据源
    }
    if (trendsState.geoRegion) {
        document.getElementById('geoRegion').value = trendsState.geoRegion;
        syncGeoSearchInput();
        previousGeoRegion = trendsState.geoRegion; // 恢复之前的地区
    }
    if (trendsState.keyword) {
        document.getElementById('keyword').value = trendsState.keyword;
        previousKeyword = trendsState.keyword; // 恢复之前的关键词
    }

    // 恢复待打开的分类列表
    pendingCategories = trendsState.pendingCategories || [];
    // 恢复当前索引
    currentIndex = trendsState.currentIndex || 0;

    // 创建选中路径的Set以提高查找效率
    const selectedPaths = new Set(trendsState.selectedCategories || []);
    const expandedPaths = new Set(trendsState.expandedNodes || []);

    // 递归处理节点
    const processNode = (node) => {
        const content = node.querySelector('.node-content');
        if (!content) return;

        const checkbox = content.querySelector('input[type="checkbox"]');
        const expander = content.querySelector('.expander');
        
        // 设置选中状态
        if (checkbox && selectedPaths.has(checkbox.dataset.path)) {
            checkbox.checked = true;
        }

        // 设置展开状态
        if (expander && expandedPaths.has(checkbox?.dataset?.path)) {
            if (expander.textContent === '+') {
                expander.click();
            }
        }

        // 处理子节点
        const children = node.querySelector('.children');
        if (children) {
            children.querySelectorAll(':scope > .tree-node').forEach(processNode);
        }
    };

    // 从根节点开始处理
    const rootNode = document.querySelector('#categoryTree');
    if (rootNode) {
        processNode(rootNode);
    }

    // 更新所有父节点的状态
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.closest('.tree-node')) {
            updateParentCheckbox(checkbox);
        }
    });

    // 更新选中数量
    updateSelectedCount();
}

// 渲染树节点
function renderTree(node, container) {
    const nodeDiv = document.createElement('div');
    nodeDiv.className = 'tree-node';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'node-content';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.dataset.id = node.id;
    checkbox.dataset.path = node.path;
    checkbox.addEventListener('change', () => {
        updateChildCheckboxes(checkbox);
        updateParentCheckbox(checkbox);
        updateSelectedCount();
        saveState();
    });

    let expander = null;
    if (node.children && node.children.length > 0) {
        expander = document.createElement('span');
        expander.className = 'expander';
        expander.textContent = '+';
        expander.addEventListener('click', () => {
            const childrenDiv = nodeDiv.querySelector('.children');
            if (expander.textContent === '+') {
                expander.textContent = '-';
                childrenDiv.style.display = 'block';
            } else {
                expander.textContent = '+';
                childrenDiv.style.display = 'none';
            }
            saveState();
        });
        contentDiv.appendChild(expander);
    }

    contentDiv.appendChild(checkbox);

    const nameSpan = document.createElement('span');
    nameSpan.className = 'node-name';
    nameSpan.textContent = node.name;
    contentDiv.appendChild(nameSpan);

    nodeDiv.appendChild(contentDiv);

    if (node.children && node.children.length > 0) {
        const childrenDiv = document.createElement('div');
        childrenDiv.className = 'children';
        childrenDiv.style.display = 'none';
        node.children.forEach(child => renderTree(child, childrenDiv));
        nodeDiv.appendChild(childrenDiv);
    }

    container.appendChild(nodeDiv);
}

// 初始化选项
function initializeOptions() {
    // 时间范围选项
    const timeRangeSelect = document.getElementById('timeRange');
    timeRanges.forEach(option => {
        const el = document.createElement('option');
        el.value = option.id;
        el.textContent = option.name;
        timeRangeSelect.appendChild(el);
    });
    timeRangeSelect.addEventListener('change', saveState);

    // 数据来源选项
    const dataSourceSelect = document.getElementById('dataSource');
    dataSources.forEach(option => {
        const el = document.createElement('option');
        el.value = option.id;
        el.textContent = option.name;
        dataSourceSelect.appendChild(el);
    });
    dataSourceSelect.addEventListener('change', saveState);

    // 国家/地区选项
    const geoRegionSelect = document.getElementById('geoRegion');
    const geoSearchInput = document.getElementById('geoSearch');
    const searchResults = document.getElementById('searchResults');
    const clearGeoBtn = document.getElementById('clearGeo');

    // 更新清除按钮的可见性
    function updateClearButtonVisibility() {
        if (geoSearchInput.value) {
            clearGeoBtn.classList.add('visible');
        } else {
            clearGeoBtn.classList.remove('visible');
        }
    }

    // 清除地区选择
    function clearGeoSelection() {
        geoRegionSelect.value = '';
        geoSearchInput.value = '';
        searchResults.style.display = 'none';
        clearGeoBtn.classList.remove('visible');
        saveState();
    }
    
    // 更新搜索结果列表
    function updateSearchResults(searchText = '') {
        const filteredRegions = searchText 
            ? geoRegions.filter(region => 
                `${region.name} ${region.id}`.toLowerCase().includes(searchText.toLowerCase()))
            : geoRegions; // 当搜索文本为空时，显示所有选项
        
        // 清空并更新搜索结果
        searchResults.innerHTML = '';
        
        if (filteredRegions.length > 0) {
            filteredRegions.forEach(region => {
                const div = document.createElement('div');
                div.className = 'search-result-item';
                if (region.id === geoRegionSelect.value) {
                    div.classList.add('active');
                }
                div.textContent = region.name;
                div.addEventListener('click', () => {
                    // 更新select的值
                    geoRegionSelect.value = region.id;
                    // 更新输入框的值
                    geoSearchInput.value = region.name;
                    // 更新清除按钮
                    updateClearButtonVisibility();
                    // 隐藏搜索结果
                    searchResults.style.display = 'none';
                    // 保存状态
                    saveState();
                });
                searchResults.appendChild(div);
            });
            searchResults.style.display = 'block';
        } else {
            searchResults.style.display = 'none';
        }
    }

    // 初始化地区选项到隐藏的select中
    geoRegions.forEach(option => {
        const el = document.createElement('option');
        el.value = option.id;
        el.textContent = option.name;
        geoRegionSelect.appendChild(el);
    });

    // 添加事件监听
    geoSearchInput.addEventListener('input', (e) => {
        updateSearchResults(e.target.value.trim());
        updateClearButtonVisibility();
    });

    clearGeoBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止触发外部点击事件
        clearGeoSelection();
    });

    // 点击外部时隐藏搜索结果
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.option-group')) {
            searchResults.style.display = 'none';
        }
    });

    // 在搜索框获得焦点时显示搜索结果
    geoSearchInput.addEventListener('focus', () => {
        updateSearchResults(geoSearchInput.value.trim());
    });

    // 初始化时更新清除按钮状态
    updateClearButtonVisibility();

    // 添加打开选中分类的事件监听
    document.getElementById('openSelected').addEventListener('click', openSelected);

    // 添加关键词输入框的change事件监听
    document.getElementById('keyword').addEventListener('input', saveState);

    // 添加隐藏地图区域的change事件监听
    document.getElementById('hideGeoMap').addEventListener('change', (e) => {
        chrome.storage.local.set({ hideGeoMap: e.target.checked });
    });

    // 恢复隐藏地图区域的状态
    chrome.storage.local.get('hideGeoMap', ({ hideGeoMap }) => {
        if (hideGeoMap !== undefined) {
            document.getElementById('hideGeoMap').checked = hideGeoMap;
        }
    });
}

// 打开选中的分类
function openSelected() {
    const selectedCategories = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        if (checkbox.dataset.path) {
            // 添加当前分类和所有父分类的ID
            const pathParts = checkbox.dataset.path.split('/');
            pathParts.forEach(id => {
                if (!selectedCategories.includes(id)) {
                    selectedCategories.push(id);
                }
            });
        }
    });

    if (selectedCategories.length === 0) {
        alert('请选择至少一个分类');
        return;
    }

    const timeRange = document.getElementById('timeRange').value;
    const dataSource = document.getElementById('dataSource').value;
    const geoRegion = document.getElementById('geoRegion').value;
    const keyword = document.getElementById('keyword').value.trim();
    if (JSON.stringify(pendingCategories) !== JSON.stringify(selectedCategories) ||
        timeRange !== previousTimeRange || 
        dataSource !== previousDataSource || 
        geoRegion !== previousGeoRegion || 
        normalizeKeywords(keyword) !== normalizeKeywords(previousKeyword)) {
        pendingCategories = selectedCategories;
        currentIndex = 0; // 重置索引
    }

    // 打开下一个5个分类
    const categoriesToOpen = pendingCategories.slice(currentIndex, currentIndex + 5);
    categoriesToOpen.forEach(category => {
        const url = new URL('https://trends.google.com/trends/explore');
        url.searchParams.append('date', timeRange);
        if (dataSource) url.searchParams.append('gprop', dataSource);
        if (geoRegion && geoRegion.toLowerCase() !== 'global') {
            url.searchParams.append('geo', geoRegion);
        }
        if (keyword) {
            // 处理多个关键词，以英文逗号分割
            const keywords = keyword.split(',').map(k => k.trim()).filter(k => k);
            if (keywords.length > 0) {
                url.searchParams.append('q', keywords.join(','));
            }
        }
        url.searchParams.append('cat', category);
        
        chrome.tabs.create({ url: url.toString() });
    });

    // 更新当前索引
    currentIndex += 5;
    if (currentIndex >= pendingCategories.length) {
        currentIndex = 0; // 如果已打开所有分类，则重置索引
    }

    // 更新之前的参数
    previousTimeRange = timeRange;
    previousDataSource = dataSource;
    previousGeoRegion = geoRegion;
    previousKeyword = keyword;

    saveState();
}

// 标准化关键词，用于比较
function normalizeKeywords(keyword) {
    if (!keyword) return '';
    return keyword.split(',')
        .map(k => k.trim())
        .filter(k => k)
        .join(',');
}

// 初始化之前的参数
let previousTimeRange = '';
let previousDataSource = '';
let previousGeoRegion = '';
let previousKeyword = '';

// 更新父节点的复选框状态
function updateParentCheckbox(checkbox) {
    const treeNode = checkbox.closest('.tree-node');
    const parentNode = treeNode.parentElement.closest('.tree-node');
    if (parentNode) {
        const parentCheckbox = parentNode.querySelector('input[type="checkbox"]');
        const siblingCheckboxes = treeNode.parentElement.querySelectorAll(':scope > .tree-node > .node-content > input[type="checkbox"]');
        const allChecked = Array.from(siblingCheckboxes).every(cb => cb.checked);
        const someChecked = Array.from(siblingCheckboxes).some(cb => cb.checked);
        
        parentCheckbox.checked = allChecked;
        parentCheckbox.indeterminate = !allChecked && someChecked;

        // 递归更新上层节点
        updateParentCheckbox(parentCheckbox);
    }
}

// 更新子节点的复选框状态
function updateChildCheckboxes(checkbox) {
    const treeNode = checkbox.closest('.tree-node');
    const childCheckboxes = treeNode.querySelectorAll('.children input[type="checkbox"]');
    childCheckboxes.forEach(childCheckbox => {
        childCheckbox.checked = checkbox.checked;
        childCheckbox.indeterminate = false;
    });
}

// 更新选中项数量
function updateSelectedCount() {
    const checkboxes = document.querySelectorAll('#categoryTree input[type="checkbox"]');
    const selectedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    document.getElementById('selectedCount').textContent = selectedCount;
}

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
    // 初始化选项
    initializeOptions();
    
    // 初始化树
    const treeContainer = document.getElementById('categoryTree');
    const rootNode = transformData(categoryData);
    renderTree(rootNode, treeContainer);
    
    // 恢复之前的状态
    await restoreState();

    // 初始更新选中数量
    updateSelectedCount();
});
