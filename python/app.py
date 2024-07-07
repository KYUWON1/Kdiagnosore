from flask import Flask, request, jsonify
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import joblib # 라벨 저장용
import torch

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

# 모델과 토크나이저 불러오기
model_save_path = './models/Bert_model_2'

loaded_model = AutoModelForSequenceClassification.from_pretrained(model_save_path)
loaded_tokenizer = AutoTokenizer.from_pretrained(model_save_path)

# 파일로부터 라벨 인코더 객체 불러오기
label_encoder = joblib.load('./labels/label_encoder.pkl')

# 장치 설정
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
loaded_model.to(device)

# 테스트 함수
def test_model(model, tokenizer, question):
    model.eval()
    with torch.no_grad():
        inputs = tokenizer(question, return_tensors="pt", padding=True, truncation=True, max_length=128)
        inputs = {key: value.to(device) for key, value in inputs.items()}
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_label_idx = torch.argmax(logits, axis=1).item()
        predicted_label = label_encoder.inverse_transform([predicted_label_idx])[0]
        return predicted_label

# API 엔드포인트 설정
@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    question = data['question']
    print("Received question:", question)  # 요청 받은 데이터 출력
    if 'question' not in data:
        return jsonify({'error': 'No question provided'}), 400
    answer = test_model(loaded_model, loaded_tokenizer, question)
    print("Response answer:", answer)  # 응답 전 데이터 출력
    response = jsonify({'answer': answer})
    response.charset = 'utf-8'
    response.headers.add('Content-Type', 'application/json; charset=utf-8')
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
