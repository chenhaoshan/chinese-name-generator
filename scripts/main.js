// 获取DOM元素
const englishNameInput = document.getElementById('englishName');
const generateBtn = document.getElementById('generateBtn');
const resultsSection = document.getElementById('resultsSection');
const nameSuggestions = document.getElementById('nameSuggestions');

// 示例数据 - 后续可以扩展为从服务器获取
const sampleNames = [
    {
        chinese: '米凯乐',
        pinyin: 'Mi Kai Le',
        meaning: '凯旋欢乐',
        english: 'One who brings joy and triumph',
        culture: '象征积极向上，充满活力'
    },
    {
        chinese: '明凯洛',
        pinyin: 'Ming Kai Luo',
        meaning: '聪明开朗',
        english: 'Bright and cheerful spirit',
        culture: '展现智慧与开放的胸怀'
    },
    {
        chinese: '麦克龙',
        pinyin: 'Mai Ke Long',
        meaning: '卓越非凡',
        english: 'Distinguished and extraordinary',
        culture: '体现独特个性与远大志向'
    }
];

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
        // 使用智谱API直接从前端调用
        const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer f304732420bd4d728d5ea0dc3ce594cf.KxrSk6ZdMWpUfBk4'
            },
            body: JSON.stringify({
                model: "glm-4-flash",
                messages: [
                    {
                        role: "user",
                        content: `你现在是一位精通中英文的专业翻译，特别擅长为外国人起富有文化内涵的中文名字。请根据以下英文名 "${englishName}" 生成3个中文名字建议。

要求：
1. 名字发音要尽可能接近原英文名
2. 使用常见、优雅的汉字
3. 符合中国传统起名习惯
4. 避免不雅或负面含义的字词
5. 字义需积极向上

请严格按照以下JSON格式输出，不要包含其他内容：
{
  "suggestions": [
    {
      "chinese": "中文名字",
      "pinyin": "拼音（用空格分隔）",
      "meaning": "名字的整体寓意（20字以内）",
      "english": "英文解释（30字以内）",
      "culture": "文化内涵解释（30字以内）",
      "characters": [
        {
          "char": "单字",
          "meaning": "该字的含义解释（10字以内）"
        }
      ]
    }
  ]
}`
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error('名字生成失败，请稍后重试');
        }

        const result = await response.json();
        const content = result.choices[0].message.content;
        const data = JSON.parse(content);
        
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
