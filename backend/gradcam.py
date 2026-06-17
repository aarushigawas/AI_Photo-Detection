import tensorflow as tf
import numpy as np

from model_loader import get_model

LAST_CONV_LAYER = "Conv_1"


def make_gradcam_heatmap(img_array):

    model = get_model()

    grad_model = tf.keras.models.Model(
        model.inputs,
        [
            model.get_layer(LAST_CONV_LAYER).output,
            model.output
        ]
    )

    with tf.GradientTape() as tape:

        conv_outputs, predictions = grad_model(img_array)

        loss = predictions[:, 0]

    grads = tape.gradient(
        loss,
        conv_outputs
    )

    pooled_grads = tf.reduce_mean(
        grads,
        axis=(0, 1, 2)
    )

    conv_outputs = conv_outputs[0]

    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]

    heatmap = tf.squeeze(heatmap)

    heatmap = tf.maximum(
        heatmap,
        0
    )

    heatmap = heatmap / tf.reduce_max(heatmap)

    return heatmap.numpy()