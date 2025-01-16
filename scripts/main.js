// 获取DOM元素
const englishNameInput = document.getElementById('englishName');
const generateBtn = document.getElementById('generateBtn');
const resultsSection = document.getElementById('resultsSection');
const nameSuggestions = document.getElementById('nameSuggestions');

// 创建名字卡片的HTML
function createNameCard(name) {
    return `
        <div class="name-card">
            <h3>${name.chinese}</h3>
            <div class="name-details">
                <p><strong>拼音:</strong> ${name.pinyin}</p>
                <p><strong>寓意:</strong> ${name.meaning}</p>
                <div class="characters-section">
                    <p><strong>字义解释:</strong></p>
                    ${name.explanation}
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

// 预设的名字数据
const nameDatabase = {
    "john": [
        {
            "chinese": "江恒",
            "pinyin": "jiāng héng",
            "meaning": "如江河般永恒不变",
            "explanation": "江：江河，宽广 / 恒：永恒，持久"
        },
        {
            "chinese": "钧浩",
            "pinyin": "jūn hào",
            "meaning": "高尚且宏大的品格",
            "explanation": "钧：重要，高尚 / 浩：广大，浩然"
        },
        {
            "chinese": "俊皓",
            "pinyin": "jùn hào",
            "meaning": "英俊优秀，光明磊落",
            "explanation": "俊：英俊，优秀 / 皓：明亮，清白"
        }
    ],
    "mary": [
        {
            "chinese": "美莉",
            "pinyin": "měi lì",
            "meaning": "美丽优雅的女子",
            "explanation": "美：美丽，优美 / 莉：茉莉花，美好"
        },
        {
            "chinese": "梅瑞",
            "pinyin": "méi ruì",
            "meaning": "如梅花般坚强吉祥",
            "explanation": "梅：梅花，坚强 / 瑞：祥瑞，吉祥"
        },
        {
            "chinese": "玫睿",
            "pinyin": "méi ruì",
            "meaning": "智慧如玫瑰般绽放",
            "explanation": "玫：玫瑰，美丽 / 睿：智慧，聪明"
        }
    ],
    "david": [
        {
            "chinese": "大卫",
            "pinyin": "dà wèi",
            "meaning": "伟大的守护者",
            "explanation": "大：伟大，宏大 / 卫：守护，保护"
        },
        {
            "chinese": "德威",
            "pinyin": "dé wēi",
            "meaning": "德高望重，威望深远",
            "explanation": "德：道德，品德 / 威：威望，威仪"
        },
        {
            "chinese": "达伟",
            "pinyin": "dá wěi",
            "meaning": "通达睿智，伟大非凡",
            "explanation": "达：通达，成就 / 伟：伟大，不凡"
        }
    ]
};

// 生成名字建议
function generateNames() {
    const englishName = englishNameInput.value.trim().toLowerCase();
    
    if (!englishName) {
        alert('请输入英文名字');
        return;
    }

    showLoading();

    setTimeout(() => {
        try {
            let suggestions;
            if (nameDatabase[englishName]) {
                suggestions = nameDatabase[englishName];
            } else {
                // 如果没有找到匹配的名字，显示一个提示
                showError('抱歉，暂时没有这个英文名的建议。请尝试: John, Mary, David');
                return;
            }
            
            // 清空之前的结果
            nameSuggestions.innerHTML = '';
            
            // 生成名字建议
            suggestions.forEach(name => {
                nameSuggestions.innerHTML += createNameCard(name);
            });

        } catch (error) {
            showError('生成名字时发生错误，请稍后重试');
        } finally {
            hideLoading();
        }
    }, 1000); // 添加1秒延迟使加载效果更自然
}

// 事件监听
generateBtn.addEventListener('click', generateNames);

// 添加回车键支持
englishNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateNames();
    }
});
