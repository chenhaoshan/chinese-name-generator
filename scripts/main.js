// 获取DOM元素
const englishNameInput = document.getElementById('englishName');
const generateBtn = document.getElementById('generateBtn');
const resultsSection = document.getElementById('resultsSection');
const nameSuggestions = document.getElementById('nameSuggestions');

// 创建名字卡片的HTML
function createNameCard(name) {
    const charactersHtml = name.characters.map(char => `
        <div class="character-detail">
            <span class="chinese-char">${char.char}</span>: ${char.meaning}
        </div>
    `).join('');

    return `
        <div class="name-card">
            <h3>${name.chinese}</h3>
            <div class="name-details">
                <p><strong>拼音:</strong> ${name.pinyin}</p>
                <p><strong>寓意:</strong> ${name.meaning}</p>
                <p><strong>英文解释:</strong> ${name.english}</p>
                <p><strong>文化内涵:</strong> ${name.culture}</p>
                <div class="characters-section">
                    <p><strong>字义解释:</strong></p>
                    ${charactersHtml}
                </div>
            </div>
        </div>
    `;
}

// 显示加载状态
function showLoading() {
    generateBtn.disabled = true;
    generateBtn.textContent = '生成中...';
    nameSuggestions.innerHTML = '<div class="loading">正在生成名字，请稍候...</div>';
    resultsSection.style.display = 'block';
}

// 隐藏加载状态
function hideLoading() {
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate Names';
}

// 显示错误信息
function showError(message) {
    nameSuggestions.innerHTML = `<div class="error">${message}</div>`;
    resultsSection.style.display = 'block';
}

// 生成名字建议
async function generateNames() {
    const englishName = englishNameInput.value.trim();
    
    if (!englishName) {
        alert('请输入英文名字');
        return;
    }

    showLoading();

    try {
        const response = await fetch('https://chenhaoshan.pythonanywhere.com/generate-name', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: englishName })
        });

        if (!response.ok) {
            throw new Error('名字生成失败，请稍后重试');
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        // 清空之前的结果
        nameSuggestions.innerHTML = '';
        
        // 生成名字建议
        data.suggestions.forEach(name => {
            nameSuggestions.innerHTML += createNameCard(name);
        });

    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// 事件监听
generateBtn.addEventListener('click', generateNames);

// 添加回车键支持
englishNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateNames();
    }
});
