import { timeRanges, dataSources, geoRegions } from './constants.js';
import { categoryData } from './category.js';

// 转换数据结构
function transformData(node) {
    return {
        id: node.id,
        name: node.name,
        children: node.children ? node.children.map(child => transformData(child)) : []
    }
}

// 保存状态到 storage
async function saveState() {
    const state = {
        timeRange: document.getElementById('timeRange').value,
        dataSource: document.getElementById('dataSource').value,
        geoRegion: document.getElementById('geoRegion').value,
        selectedCategories: Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.dataset.id)
            .filter(id => id),
        expandedNodes: Array.from(document.querySelectorAll('.expander'))
            .filter(exp => exp.textContent === '-')
            .map(exp => exp.parentElement.querySelector('input[type="checkbox"]').dataset.id)
    };
    await chrome.storage.local.set({ trendsState: state });
}

// 从 storage 恢复状态
async function restoreState() {
    const { trendsState } = await chrome.storage.local.get('trendsState');
    if (!trendsState) return;

    // 恢复选项值
    if (trendsState.timeRange) {
        document.getElementById('timeRange').value = trendsState.timeRange;
    }
    if (trendsState.dataSource) {
        document.getElementById('dataSource').value = trendsState.dataSource;
    }
    if (trendsState.geoRegion) {
        document.getElementById('geoRegion').value = trendsState.geoRegion;
    }

    // 恢复选中的分类和展开状态
    trendsState.selectedCategories?.forEach(id => {
        const checkbox = document.querySelector(`input[type="checkbox"][data-id="${id}"]`);
        if (checkbox) {
            checkbox.checked = true;
            updateParentCheckbox(checkbox);
        }
    });

    trendsState.expandedNodes?.forEach(id => {
        const checkbox = document.querySelector(`input[type="checkbox"][data-id="${id}"]`);
        if (checkbox) {
            const expander = checkbox.parentElement.querySelector('.expander');
            if (expander && expander.textContent === '+') {
                expander.click();
            }
        }
    });
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
    
    function updateGeoOptions(searchText = '') {
        const currentValue = geoRegionSelect.value; // 保存当前选中的值
        geoRegionSelect.innerHTML = '';
        const filteredRegions = searchText 
            ? geoRegions.filter(region => 
                `${region.name} ${region.id}`.toLowerCase().includes(searchText.toLowerCase()))
            : geoRegions;
        
        filteredRegions.forEach(option => {
            const el = document.createElement('option');
            el.value = option.id;
            el.textContent = option.name;
            geoRegionSelect.appendChild(el);
        });

        // 如果筛选结果只有一项，直接选中
        if (filteredRegions.length === 1) {
            geoRegionSelect.value = filteredRegions[0].id;
            saveState();
        }
        // 否则，如果筛选后的结果中包含之前选中的值，则恢复选中状态
        else if (currentValue && filteredRegions.some(region => region.id === currentValue)) {
            geoRegionSelect.value = currentValue;
        }
    }

    updateGeoOptions();
    geoRegionSelect.addEventListener('change', saveState);
    
    geoSearchInput.addEventListener('input', (e) => {
        updateGeoOptions(e.target.value.trim());
    });
}

// 打开选中的分类
function openSelected() {
    const selectedCategories = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        if (checkbox.dataset.id) {
            selectedCategories.push(checkbox.dataset.id);
        }
    });

    if (selectedCategories.length === 0) {
        alert('请选择至少一个分类');
        return;
    }

    const timeRange = document.getElementById('timeRange').value;
    const dataSource = document.getElementById('dataSource').value;
    const geoRegion = document.getElementById('geoRegion').value;

    // 为每个选中的分类创建一个新标签页
    selectedCategories.forEach(category => {
        const url = new URL('https://trends.google.com/trends/explore');
        // 直接使用原始值，searchParams.append 会自动进行编码
        url.searchParams.append('date', timeRange);
        if (dataSource) url.searchParams.append('gprop', dataSource);
        // 只有当不是全球时才添加 geo 参数
        if (geoRegion && geoRegion.toLowerCase() !== 'global') {
            url.searchParams.append('geo', geoRegion);
        }
        url.searchParams.append('cat', category);
        
        chrome.tabs.create({ url: url.toString() });
    });
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
    checkbox.addEventListener('change', () => {
        updateParentCheckbox(checkbox);
        saveState(); // 保存状态
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
            saveState(); // 保存状态
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

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
    // 初始化选项
    initializeOptions();
    
    // 初始化树
    const treeContainer = document.getElementById('categoryTree');
    const rootNode = transformData(categoryData);
    renderTree(rootNode, treeContainer);
    
    // 添加按钮点击事件监听器
    document.getElementById('openSelectedBtn').addEventListener('click', openSelected);

    // 恢复之前的状态
    await restoreState();
});
