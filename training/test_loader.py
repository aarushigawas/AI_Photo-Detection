from dataset_loader import get_data_generators

train_gen, val_gen, test_gen = get_data_generators()

print("\nDataset Loaded Successfully\n")

print("Training Samples:", train_gen.samples)
print("Validation Samples:", val_gen.samples)
print("Test Samples:", test_gen.samples)

print("\nClass Mapping:")
print(train_gen.class_indices)