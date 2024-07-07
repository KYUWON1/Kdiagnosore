from transformers import AutoModelForSequenceClassification, AutoTokenizer
import joblib # 라벨 저장용
import torch

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

# 테스트 문장
test_questions = [
    "밥먹었어",
    "운동했어",
    "집에 있었어",
    "별일 없었어"
]

# 모델 테스트 실행
for question in test_questions:
    answer = test_model(loaded_model, loaded_tokenizer, question)
    print(f"Question: {question}")
    print(f"Predicted Answer: {answer}\n")
