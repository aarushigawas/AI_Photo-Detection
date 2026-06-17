import numpy as np


def generate_explanation(heatmap):

    h, w = heatmap.shape

    top = np.mean(heatmap[:h//3, :])
    middle = np.mean(heatmap[h//3:2*h//3, :])
    bottom = np.mean(heatmap[2*h//3:, :])

    left = np.mean(heatmap[:, :w//3])
    center = np.mean(heatmap[:, w//3:2*w//3])
    right = np.mean(heatmap[:, 2*w//3:])

    vertical_scores = {
        "upper": top,
        "middle": middle,
        "lower": bottom
    }

    horizontal_scores = {
        "left": left,
        "center": center,
        "right": right
    }

    strongest_vertical = max(
        vertical_scores,
        key=vertical_scores.get
    )

    strongest_horizontal = max(
        horizontal_scores,
        key=horizontal_scores.get
    )

    max_pos = np.unravel_index(
        np.argmax(heatmap),
        heatmap.shape
    )

    row, col = max_pos

    explanation = (
        f"Highest model attention was detected in the "
        f"{strongest_vertical}-{strongest_horizontal} region. "
        f"The strongest activation point occurred near "
        f"pixel ({row}, {col}) of the GradCAM map."
    )

    return explanation