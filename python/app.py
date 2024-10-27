from flask import Flask, request, jsonify
import requests as req
import os
import json
from datetime import datetime
from dotenv import load_dotenv

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

load_dotenv()

# .env 파일로부터 API KEY 설정
api_key = os.getenv('API_KEY')
chat_gpt_url = os.getenv('API_URL')
print(api_key + " : " + chat_gpt_url)

# 환경 변수 확인
if not api_key or not chat_gpt_url:
    print("Error: API_KEY or API_URL is not set.")
    exit(1)  # 필수 설정이 없으면 서버 실행 중단

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

# 현재 시간 가져오기
now = datetime.now()

# "21시 30분" 형식으로 시간 포맷팅
formatted_time = now.strftime("%H시 %M분")

# 초기 메시지 설정
request_list = [
    {
        "role": "system",
        "content":
            f"""현재 시간은 {formatted_time}입니다. 대화 종료 조건을 판단할 때 이 시간 정보를 사용합니다.

                           역할 설정:
                           당신은 일상생활에서 어떤 일이 있었는지 물어보는 챗봇입니다. 대화 상대는 성별을 알 수 없는 노인입니다. "어르신"이라는 호칭을 사용합니다.
                           항상 공손하고 존중하는 태도로 대화하며, 친절한 존댓말을 사용합니다. 오늘 하루 동안 어디서, 누구와, 무엇을 했는지 등의 육하원칙같은 구체적인 정보를 얻기 위해 질문합니다.

                           대화 지침:
                           1. 첫 질문은 "오늘 몇시에 일어나셨나요?", "아침은 뭐 드셨어요?", "오늘 날씨는 어떤가요?" 등의 질문으로 시작합니다.
                           2. 특정 활동이 언급되면, 그 주제로 대화를 이어갑니다.
                           3. 모든 추가 질문은 오늘 하루에 일어났던 일에 대해서만 물어봅니다.
                           4. 오직 '오늘' 하루에 관해 정확한 정보에 대해서만 질문 해야 합니다.
                           5. '오늘의 계획은 어떻게 되시나요?', '오늘 저녁에는 무슨 음식을 드실 예정이신가요?' 등 미래의 계획이 무엇인지는 질문하지 않습니다.
                           6. 같은 질문은 하루에 한 번만 사용합니다.
                           7. 하나의 응답에는 한가지 정보에 대해서만 질문합니다.
                           8. 하나의 주제로 5번 정도 대화를 진행하게 되면 자연스럽게 다른 주제의 질문으로 변경합니다. 다른 주제는 동일하게 오늘 하루 동안 일어났던 일의 정보를 묻는 질문이어야 합니다.
                           9. "모르겠어", "글쎄", "생각이 안나네"와 같은 답변이 사용자에게서 들어오면 즉시 다른 주제로 변경하여 질문을 이어갑니다.
                           10. 기본적으로 대화는 절대 끝나지 않게끔 항상 질문으로 이어갑니다.
                           11. 사용자가 대화를 그만하고 싶다면 더 이상 질문하지 않고 대화를 종료합니다.
                           12. 대화를 5번 이상 진행하였고, 입력받았던 현재 시간이 21시가 지났을 경우에는 자연스럽게 저녁인사를 하며 대화를 종료합니다.

                           응답 형식:
                           당신의 응답은 친절하게 반응하는 문장 1개와 질문하는 문장 1개, 오직 2개의 문장만 포함하며 응답은 50자 이하로 제한합니다.

                           대화 예시:
                           assistant : 안녕하세요, 어르신. 좋은 하루 보내고 계시죠. 오늘 아침밥은 드셨나요?
                           user : 안먹었어
                           assistant : 아침 안드셨군요. 안드시고 오전에는 어떤 일 있으셨어요?
                           user : 경로당 다녀왔어
                           assistant : 오전에 경로당 가셨군요! 가서는 누구 만나셨어요?
                           user : 춘자할머니 만났어
                           assistant : 재밌으셨겠어요!! 특별히 경로당에서는 뭐하면서 시간 보내셨어요?
                           user : 화투쳤어
                           assistant : 화투 정말 재밌죠. 오늘 바깥에 날씨는 어땠나요?!
                           user : 비가 많이 오더라
                           (이 "대화 예시"의 값과 정보가 실제 대화를 할 때에 사전적으로 사용되어서는 안됩니다.)"""
    }
]

print(request_list)
# GPT 요청 함수
def call_gpt_api(request_list, temperature=0.4, max_tokens=100):
    data = {
        "model": "gpt-4o",
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
        print(f"HTTP error occurred: {http_err}, Response: {response.text}")
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

    # 빈 질문을 받지 않도록 예외 처리
    if not question:
        return jsonify({'error': 'Invalid question'}), 400

    # 사용자 입력 추가
    request_list.append({
        "role": "user",
        "content": question
    })

    # GPT API 호출
    response = call_gpt_api(request_list)
    if response is None:
        return jsonify({'error': 'Failed to get a valid response from GPT'}), 500

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