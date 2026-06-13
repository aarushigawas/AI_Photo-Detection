import os

train_real = "dataset/train/REAL"
train_fake = "dataset/train/FAKE"

test_real = "dataset/test/REAL"
test_fake = "dataset/test/FAKE"

print("TRAIN REAL :", len(os.listdir(train_real)))
print("TRAIN FAKE :", len(os.listdir(train_fake)))

print("TEST REAL  :", len(os.listdir(test_real)))
print("TEST FAKE  :", len(os.listdir(test_fake)))