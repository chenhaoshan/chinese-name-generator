from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import json

app = Flask(__name__)
CORS(app)  # 启用CORS，允许跨域请求

# 从环境变量获取API密钥
API_KEY = os.getenv('ZHIPU_API_KEY', 'f304732420bd4d728d5ea0dc3ce594cf.KxrSk6ZdMWpUfBk4')

@app.route('/generate-name', methods=['POST'])
def generate_name():
    try:
        data = request.json
        english_name = data.get('name')
        
        if not english_name:
            return jsonify({'error': '请提供英文名字'}), 400

        # 调用智谱API
        response = requests.post(
            'https://open.bigmodel.cn/api/paas/v4/chat/completions',
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {API_KEY}'
            },
            json={
                "model": "glm-4-flash",
                "messages": [
                    {
                        "role": "user",
                        "content": f'''你现在是一位精通中英文的专业翻译，特别擅长为外国人起富有文化内涵的中文名字。请根据以下英文名 "{english_name}" 生成3个中文名字建议。

要求：
1. 名字发音要尽可能接近原英文名
2. 使用常见、优雅的汉字
3. 符合中国传统起名习惯
4. 避免不雅或负面含义的字词
5. 字义需积极向上

请严格按照以下JSON格式输出，不要包含其他内容：
{{
  "suggestions": [
    {{
      "chinese": "中文名字",
      "pinyin": "拼音（用空格分隔）",
      "meaning": "名字的整体寓意（20字以内）",
      "english": "英文解释（30字以内）",
      "culture": "文化内涵解释（30字以内）",
      "characters": [
        {{
          "char": "单字",
          "meaning": "该字的含义解释（10字以内）"
        }}
      ]
    }}
  ]
}}'''
                    }
                ]
            }
        )
        
        if response.status_code != 200:
            return jsonify({'error': '名字生成失败，请稍后重试'}), 500

        result = response.json()
        content = result['choices'][0]['message']['content']
        name_data = json.loads(content)
        
        return jsonify(name_data)

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': '服务器错误，请稍后重试'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
