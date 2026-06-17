import cv2
import numpy as np
import uuid


def save_heatmap(heatmap, processed_image):

    heatmap = np.uint8(
        255 * heatmap
    )

    heatmap = cv2.resize(
        heatmap,
        (224, 224),
        interpolation=cv2.INTER_LINEAR
    )

    heatmap_color = cv2.applyColorMap(
        heatmap,
        cv2.COLORMAP_JET
    )

    original_img = np.uint8(
        processed_image[0] * 255
    )

    overlay = cv2.addWeighted(
        original_img,
        0.6,
        heatmap_color,
        0.4,
        0
    )

    filename = f"{uuid.uuid4().hex}.png"

    filepath = f"heatmaps/{filename}"

    cv2.imwrite(
        filepath,
        overlay
    )

    return filename