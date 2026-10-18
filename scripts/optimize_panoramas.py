import os
import sys
from PIL import Image

PANO_DIR = r"d:\campus_connect\CampusConnect\frontend\public\panoramas"
TARGET_WIDTH = 4096
TARGET_HEIGHT = 2048
QUALITY = 88

def optimize_all():
    print(f"Optimizing panoramas in: {PANO_DIR}")
    print(f"Target size: {TARGET_WIDTH}x{TARGET_HEIGHT}, JPEG Quality: {QUALITY}")
    
    files = [f for f in os.listdir(PANO_DIR) if f.lower().endswith(('.jpg', '.jpeg'))]
    print(f"Found {len(files)} panorama files.")
    
    for f in sorted(files):
        path = os.path.join(PANO_DIR, f)
        try:
            with Image.open(path) as img:
                orig_size = img.size
                orig_mb = os.path.getsize(path) / (1024 * 1024)
                
                if orig_size[0] > TARGET_WIDTH or orig_size[1] > TARGET_HEIGHT:
                    resized = img.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.LANCZOS)
                    if resized.mode != "RGB":
                        resized = resized.convert("RGB")
                    resized.save(path, "JPEG", quality=QUALITY, optimize=True)
                    new_mb = os.path.getsize(path) / (1024 * 1024)
                    print(f"[OK] {f}: {orig_size} ({orig_mb:.2f}MB) -> {(TARGET_WIDTH, TARGET_HEIGHT)} ({new_mb:.2f}MB)")
                else:
                    print(f"[-] {f}: already {orig_size} ({orig_mb:.2f}MB), skipped.")
        except Exception as e:
            print(f"[FAIL] {f}: {e}")

if __name__ == "__main__":
    optimize_all()
