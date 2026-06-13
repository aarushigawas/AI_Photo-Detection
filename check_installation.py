print("=" * 50)
print("CHECKING INSTALLATIONS")
print("=" * 50)

packages = [
    ("TensorFlow", "tensorflow"),
    ("Keras", "keras"),
    ("NumPy", "numpy"),
    ("Pandas", "pandas"),
    ("Matplotlib", "matplotlib"),
    ("Seaborn", "seaborn"),
    ("Scikit-Learn", "sklearn"),
    ("OpenCV", "cv2"),
    ("Pillow", "PIL"),
    ("FastAPI", "fastapi"),
    ("Uvicorn", "uvicorn"),
    ("Pydantic", "pydantic"),
    ("Dotenv", "dotenv"),
]

for name, module in packages:
    try:
        pkg = __import__(module)

        version = getattr(pkg, "__version__", "Version not available")

        print(f"✅ {name:<15} | {version}")

    except Exception as e:
        print(f"❌ {name:<15} | ERROR: {e}")

print("=" * 50)

# TensorFlow GPU/CPU check
try:
    import tensorflow as tf

    print("\nTensorFlow Devices:")
    print(tf.config.list_physical_devices())

except Exception as e:
    print(f"\nTensorFlow device check failed: {e}")

print("\nSetup verification complete.")