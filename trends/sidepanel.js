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

    // 数据来源选项
    const dataSourceSelect = document.getElementById('dataSource');
    dataSources.forEach(option => {
        const el = document.createElement('option');
        el.value = option.id;
        el.textContent = option.name;
        dataSourceSelect.appendChild(el);
    });

    // 国家/地区选项
    const geoRegionSelect = document.getElementById('geoRegion');
    const geoSearchInput = document.getElementById('geoSearch');
    
    function updateGeoOptions(searchText = '') {
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
    }

    // 初始化地区选项
    updateGeoOptions();

    // 添加搜索事件监听
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

    const url = new URL('https://trends.google.com/trends/explore');
    url.searchParams.append('date', timeRange);
    if (dataSource) url.searchParams.append('gprop', dataSource);
    if (geoRegion) url.searchParams.append('geo', geoRegion);
    url.searchParams.append('cat', selectedCategories.join(','));

    chrome.tabs.create({ url: url.toString() });
}
window.openSelected = openSelected;

// 渲染树节点
function renderTree(node, container) {
    const nodeDiv = document.createElement('div');
    nodeDiv.className = 'tree-node';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'node-content';

    // 添加展开/折叠图标
    const expander = document.createElement('span');
    expander.className = 'expander';
    if (node.children && node.children.length > 0) {
        expander.textContent = '▶'; // 默认显示折叠图标
        expander.style.cursor = 'pointer';
        expander.onclick = () => {
            const childrenDiv = nodeDiv.querySelector('.children');
            const isExpanded = childrenDiv.style.display !== 'none';
            childrenDiv.style.display = isExpanded ? 'none' : 'block';
            expander.textContent = isExpanded ? '▶' : '▼';
        };
    } else {
        expander.textContent = '•';
        expander.style.color = '#999';
    }
    contentDiv.appendChild(expander);

    // 添加复选框
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    if (node.id) {
        checkbox.dataset.id = node.id;
    }
    checkbox.onchange = () => {
        // 如果选中，递归选中所有子节点
        if (node.children) {
            const childCheckboxes = nodeDiv.querySelectorAll('.children input[type="checkbox"]');
            childCheckboxes.forEach(cb => cb.checked = checkbox.checked);
        }
        // 更新父节点状态
        updateParentCheckbox(checkbox);
    };
    contentDiv.appendChild(checkbox);

    // 添加名称
    const nameSpan = document.createElement('span');
    nameSpan.className = 'node-name';
    nameSpan.textContent = node.name;
    contentDiv.appendChild(nameSpan);

    nodeDiv.appendChild(contentDiv);

    // 如果有子节点，递归渲染
    if (node.children && node.children.length > 0) {
        const childrenDiv = document.createElement('div');
        childrenDiv.className = 'children';
        childrenDiv.style.display = 'none'; // 默认隐藏子节点
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
document.addEventListener('DOMContentLoaded', () => {
    // 初始化选项
    initializeOptions();

    // 渲染分类树
    const container = document.getElementById('categoryTree');
    const transformedData = transformData(categoryData);
    renderTree(transformedData, container);
});
