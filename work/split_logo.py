"""Split the Masar Jadid logo (black calligraphy + red & green swooshes on white) into
transparent layers: logo.png (all), logo_text.png, logo_red.png, logo_green.png (4x Lanczos, same canvas)."""
import sys
import numpy as np
from PIL import Image

src, outdir = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGBA")
bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
im = Image.alpha_composite(bg, im).convert("RGB")
im = im.resize((im.width * 4, im.height * 4), Image.LANCZOS)
c = np.asarray(im).astype(np.float32) / 255.0
# colour-to-alpha against white
a = np.clip((1.0 - c).max(axis=2), 0, 1)
a = np.clip((a - 0.04) / 0.96, 0, 1)
safe = np.maximum(a, 1e-4)[..., None]
col = np.clip((c - (1 - safe)) / safe, 0, 1)
r, g, b = col[..., 0], col[..., 1], col[..., 2]
is_red = (r > g + 0.25) & (r > b + 0.2)
is_green = (g > r + 0.1) & (g > b)
is_text = ~(is_red | is_green)

def save(mask, name, color=None):
    rgb = col.copy()
    if color is not None:
        rgb[:] = np.array(color, np.float32) / 255
    alpha = np.where(mask, a, 0)
    out = np.dstack([rgb, alpha])
    img = Image.fromarray((out * 255 + 0.5).astype(np.uint8), "RGBA")
    img.save(f"{outdir}/{name}")
    ys, xs = np.nonzero(alpha > 0.1)
    print(name, img.size, "bbox", xs.min(), ys.min(), xs.max(), ys.max())

# median colours for brand tokens
for nm, m in [("red", is_red & (a > 0.9)), ("green", is_green & (a > 0.9)), ("text", is_text & (a > 0.9))]:
    med = (np.median(col[m], axis=0) * 255).astype(int)
    print(nm, "#%02X%02X%02X" % tuple(med))
save(np.ones_like(a, bool), "logo.png")
save(is_text, "logo_text.png")
save(is_red, "logo_red.png")
save(is_green, "logo_green.png")
save(np.ones_like(a, bool), "logo_white.png", (255, 255, 255))
