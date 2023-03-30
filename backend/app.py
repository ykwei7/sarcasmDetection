from flask import Flask, request, jsonify
from flask_cors import CORS
from keras_preprocessing.sequence import pad_sequences
import keras
import pandas as pd
import re
from keras.preprocessing.text import Tokenizer
import csv
import numpy as np
from lime.lime_text import LimeTextExplainer

app = Flask(__name__)
CORS(app)

max_length = 75

@app.route('/')
def api_health():
    response = jsonify('API is working!')
    return response

def clean_text(text):
    text = str(text)
    text = text.lower()
    
    pattern = re.compile('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')
    text = pattern.sub('', text)
    text = " ".join(filter(lambda x:x[0]!='@', text.split()))
    emoji = re.compile("["
                           u"\U0001F600-\U0001FFFF"  # emoticons
                           u"\U0001F300-\U0001F5FF"  # symbols & pictographs
                           u"\U0001F680-\U0001F6FF"  # transport & map symbols
                           u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
                           u"\U00002702-\U000027B0"
                           u"\U000024C2-\U0001F251"
                           "]+", flags=re.UNICODE)
    
    text = emoji.sub(r'', text) # Removing emojis
    text = text.lower() 
    text = re.sub(r"i'm", "i am", text) # Expanding the word to full form
    text = re.sub(r"he's", "he is", text)
    text = re.sub(r"she's", "she is", text)
    text = re.sub(r"that's", "that is", text)        
    text = re.sub(r"what's", "what is", text)
    text = re.sub(r"where's", "where is", text) 
    text = re.sub(r"\'ll", " will", text)  
    text = re.sub(r"\'ve", " have", text)  
    text = re.sub(r"\'re", " are", text)
    text = re.sub(r"\'d", " would", text)
    text = re.sub(r"\'ve", " have", text)
    text = re.sub(r"won't", "will not", text)
    text = re.sub(r"don't", "do not", text)
    text = re.sub(r"did't", "did not", text)
    text = re.sub(r"can't", "can not", text)
    text = re.sub(r"it's", "it is", text)
    text = re.sub(r"couldn't", "could not", text)
    text = re.sub(r"have't", "have not", text)
    text = re.sub(r"[,.\"\'!@#$%^&*(){}?/;`~:<>+=-]", "", text) # Remove stop punctuations
    return text

import string
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
nltk.download('punkt')
nltk.download('stopwords')

model = None
tokenizer_obj = None

def CleanTokenize(df):
    head_lines = list()
    lines = df["comment"].values.tolist()

    for line in lines:
        line = clean_text(line)
        # tokenize the text
        tokens = word_tokenize(line)
        # remove punctuations
        table = str.maketrans('', '', string.punctuation)
        stripped = [w.translate(table) for w in tokens]
        # remove non alphabetic characters
        words = [word for word in stripped if word.isalpha()]
        # stop_words = set(stopwords.words("english"))
        # remove stop words
        # words = [w for w in words if not w in stop_words]
        head_lines.append(words)
    return head_lines

vocab_size = 50000
embedding_dim = 64
max_length = 25
trunc_type='post'
padding_type='post'
oov_tok = "<OOV>"
class_names=['not sarcastic','sarcastic']
explainer= LimeTextExplainer(class_names=class_names)
  

def predictTextArray(text):
   text = pd.DataFrame({"comment":text})
   text = CleanTokenize(text)
   list_tokenized_ex = tokenizer_obj.texts_to_sequences(text)
   Ex = np.array(pad_sequences(list_tokenized_ex, maxlen=max_length, padding=padding_type, truncating=trunc_type))
   pred=model.predict(Ex)
   # Explainable AI (using LIME)
   # https://jovian.ai/rajbsangani/lime-medium
   returnable=[]
   for i in pred:
    temp=i[0]    
    returnable.append(np.array([1,1-temp]))
   return np.array(returnable)

def compare_pred_labels(pred, text):
  pred = [i[1] for i in pred]
  pred = np.round(pred).astype(int)
  exp = explainer.explain_instance(text, predictTextArray)
  return exp.as_list()
    
@app.route('/predict', methods=["POST"])
def predict_sarcasm():
    predicted_labels = predictTextArray([request.json['text']])
    res = compare_pred_labels(predicted_labels, request.json['text'])
    return res

if __name__ == '__main__':
    model = keras.models.load_model("rnn_modelv2/rnn_model")
    tokenizer_obj = Tokenizer()
    with open('tokens.csv', 'r') as read_obj:
        csv_reader = csv.reader(read_obj)
        # convert string to list
        tokens = list(csv_reader)
    tokenizer_obj.fit_on_texts(tokens)
    app.run(debug=True)