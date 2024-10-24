from flask import Flask, request, jsonify
import requests as req
import os
import json
from dotenv import load_dotenv

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

load_dotenv()

# .env 파일로부터 API KEY 설정
api_key = os.getenv('API_KEY')
chat_gpt_url = os.getenv('API_URL')
print(api_key + " : " + chat_gpt_url)

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

# 초기 메시지 설정
request_list = [
    {
        "role": "system",
        "content":
            """당신은 대화를 이어나가는 일상생활 챗봇입니다. 당신이 대화하는 상대는 성별을 알 수 없는 노인입니다. 따라서 호칭은 "어르신"으로 지정합니다.
            공손하고 존중하는 태도로 대화하며, 친절한 존댓말로 응답합니다. 반응은 명확하고 짧으며, 어르신의 이야기에 관심을 기울이는 질문을 던집니다. 상대방이 오늘 무엇을 하면서 하루를 보냈는지에 대한 구체적이고 명확한 정보를 얻는 질문을 던집니다.
            사용자가 특정 활동을 언급하면 그 활동에 대한 맞춤형 반응을 하십시오. 예를 들어, 사용자가 '산책'을 언급하면 산책의 경험에 대해 더 묻거나 반응을 구체적으로 하세요.
            assistant의 1개의 응답에는 질문형 문장은 오직 1개만 포함합니다.

            대화 예시)
            assistant : 안녕하세요, 어르신. 좋은 아침입니다. 오늘 아침밥은 드셨나요?
            user : 안먹었어
            assistant : 아침 안드셨군요. 안드시고 오전에는 어떤 일 있으셨어요?
            user : 경로당 다녀왔어
            assistant : 오전에 경로당 가셨군요! 가서는 누구 만나셨어요?
            user : 춘자할머니 만났어
            assistant : 재밌으셨겠어요!! 오늘 날씨는 어땠나요?!
            user : 비가 많이 오더라

            "대화 예시"의 값과 정보가 실제 대화를 할 때에 사전적으로 사용되어서는 안됩니다.
            또한 assistant가 하는 질문은 반복적이지 않습니다. 상대방의 답변에 대해 적절히 반응하며 추가적인 또다른 정보를 얻는 질문으로 응답해야 합니다.

            **중요 지시사항:**
            1. 응답의 길이는 반드시 50자 이하로 제한하세요.
            2. 질문은 하나만 포함하고, 간결하게 대답합니다.
            3. 짧고 간결하게 대답하고 질문합니다."""
    }
]

# GPT 요청 함수
def call_gpt_api(request_list, temperature=0.4, max_tokens=100):
    data = {
        "model": "gpt-3.5-turbo",
        "messages": request_list,
        "temperature": temperature,     # 응답의 창의성 조절
        "max_tokens": max_tokens,       # 응답 길이 제한
        "top_p": 0.8                    # Nucleus Sampling 설정
    }

    try:
        # API 호출
        response = req.post(chat_gpt_url, headers=headers, json=data)
        response.raise_for_status()  # 상태 코드가 200이 아닐 경우 예외 발생
        return response.json()
    except req.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except Exception as err:
        print(f"An error occurred: {err}")
    return None

# 챗봇 응답 처리 함수
def handle_bot_response(response):
    if response and "choices" in response:
        bot_response = response["choices"][0]["message"]["content"]
        print(f"챗봇: {bot_response}")
        return bot_response
    else:
        print("Invalid response from API.")
        return None

# API 엔드포인트 설정
@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    if 'question' not in data:
        return jsonify({'error': 'No question provided'}), 400

    question = data['question']
    print("Received question : ", question)

    # 사용자 입력 추가
    request_list.append({
        "role": "user",
        "content": question
    })

    # GPT API 호출
    response = call_gpt_api(request_list)
    bot_response = handle_bot_response(response)


    if bot_response:
        # 응답 기록 추가
        request_list.append({
            "role": "assistant",
            "content": bot_response
        })
        answer = bot_response
        print("Response answer:", answer)  # 응답 전 데이터 출력
        response = jsonify({'answer': answer})
        response.charset = 'utf-8'
        response.headers.add('Content-Type', 'application/json; charset=utf-8')
        return response
    else:
        return jsonify({'error': 'Failed to get a valid response from GPT'}), 500



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)