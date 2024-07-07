from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
import torch
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from torch.utils.data import Dataset, DataLoader
import joblib # 라벨 저장용
## 학습 데이터셋 설정 부분

import csv
import pandas as pd

# 파일 경로
file_path = './dataset/dataset1.csv'

# 질문과 답변을 저장할 리스트
questions = []
answers = []

# CSV 파일 읽기 (처음 10000 행만 읽기)
with open(file_path, mode='r', encoding='utf-8') as file:
    csv_reader = csv.DictReader(file)
    for i, row in enumerate(csv_reader):
        if i >= 10000:  # 5000개의 행까지만 처리
            break
        questions.append(row['Q'])  # 질문 컬럼
        answers.append(row['A'])    # 답변 컬럼

# 결과 출력
print(len(answers))
print(len(questions))

# CSV 파일 읽기
df = pd.read_csv('./dataset/dataset1.csv',nrows=10000)
# 질문과 답변을 결합한 새로운 열 생성
df['QA_pair'] = df['Q'] + " [SEP] " + df['A']

# 'QA_pair' 열에서 고유한 값들의 수를 계산
unique_qa_pairs = df['QA_pair'].unique()
num_unique_qa_pairs = len(unique_qa_pairs)

print(f"Number of unique Q&A pairs: {num_unique_qa_pairs}")

## 모델링 학습 부분

## 사전에 학습된 모델 불러오기
MODEL_NAME = "bert-base-multilingual-cased"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=num_unique_qa_pairs)  # 4개의 질문 유형

#라벨 저장 경로
label_path = './labels/label_encoder.pkl'

# 답변 라벨 인코딩
label_encoder = LabelEncoder()
labels = label_encoder.fit_transform(answers)

# 라벨 인코더 저장
joblib.dump(label_encoder, label_path)

# 데이터셋 클래스 정의
class ChatDataset(Dataset):
    def __init__(self, questions, labels, tokenizer, max_length=128):
        self.questions = questions
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.questions)

    def __getitem__(self, idx):
        question = self.questions[idx]
        label = self.labels[idx]
        encoding = self.tokenizer(
            question,
            add_special_tokens=True,
            max_length=self.max_length,
            truncation=True,
            padding='max_length',
            return_attention_mask=True,
            return_tensors='pt'
        )
        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(label, dtype=torch.long)
        }

# 이제 데이터셋 인스턴스 생성 시 tokenizer도 전달
dataset = ChatDataset(questions, labels, tokenizer)

# 훈련 및 검증 데이터셋 분할
train_size = int(0.8 * len(dataset))
val_size = len(dataset) - train_size
train_dataset, val_dataset = torch.utils.data.random_split(dataset, [train_size, val_size])

# 훈련 인자 설정
training_args = TrainingArguments(
    output_dir='./results',          # 모델 출력 경로
    evaluation_strategy="epoch",     # 평가 전략
    learning_rate=2e-5,              # 학습률
    per_device_train_batch_size=16,  # 훈련 배치 크기
    per_device_eval_batch_size=64,   # 평가 배치 크기
    num_train_epochs=5,              # 에폭 수
    weight_decay=0.01,               # 가중치 감소
)

# 트레이너 초기화
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset
)

# 훈련 시작
trainer.train()

#모델 저장 부분

model_save_path = './models/Bert_model_2'

model.save_pretrained(model_save_path)
tokenizer.save_pretrained(model_save_path)

## 검증부분

# 검증 데이터셋에 대한 모델 평가
evaluation_result = trainer.evaluate(eval_dataset=val_dataset)
print("Evaluation Results:", evaluation_result)

## 테스트 부분

def test_model(model, tokenizer, question):
    model.eval()  # 모델을 평가 모드로 설정
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")  # 사용할 장치 선택
    model.to(device)  # 모델을 해당 장치로 이동

    with torch.no_grad():  # 그라디언트 계산을 중지
        inputs = tokenizer(question, return_tensors="pt", padding=True, truncation=True, max_length=128)
        inputs = {key: value.to(device) for key, value in inputs.items()}  # 입력 데이터를 해당 장치로 이동
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_label_idx = torch.argmax(logits, axis=1).item()  # 가장 높은 점수의 레이블 인덱스
        predicted_label = label_encoder.inverse_transform([predicted_label_idx])[0]  # 인덱스를 레이블로 변환
        return predicted_label

# 테스트 문장
test_questions = [
    "롤 했어",
    "운동 했어",
    "대답하고 싶지 않아",
    "카페 갔어"
]

# 모델 테스트 실행
for question in test_questions:
    answer = test_model(model, tokenizer, question)
    print(f"Question: {question}")
    print(f"Predicted Answer: {answer}\n")


