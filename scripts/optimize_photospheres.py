import os
import time
from PIL import Image

def optimize_panoramas():
    dir_path = os.path.join(os.path.dirname(__file__), '../frontend/public/panoramas')
    target_width = 4096
    target_height = 2048
    
    files = sorted([f for f in os.listdir(dir_path) if f.endswith('.jpg')])
    print(f"Checking {len(files)} panorama files in {dir_path}...")
    
    optimized_count = 0
    start_time = time.time()
    
    for filename in files:
        file_path = os.path.join(dir_path, filename)
        try:
            with Image.open(file_path) as img:
                orig_w, orig_h = img.size
                if orig_w <= target_width and orig_h <= target_height:
                    continue
                
                print(f"Optimizing {filename} from {orig_w}x{orig_h} to {target_width}x{target_height}...")
                xmp_data = img.info.get('xmp')
                
                # Update XMP cropped/full pano sizes if present
                if xmp_data:
                    try:
                        xmp_str = xmp_data.decode('utf-8', errors='ignore')
                        xmp_str = xmp_str.replace(str(orig_w), str(target_width))
                        xmp_str = xmp_str.replace(str(orig_h), str(target_height))
                        xmp_data = xmp_str.encode('utf-8')
                    except Exception as ex:
                        pass
                
                # Resize with high quality Lanczos filter
                resized = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
                
                # Save to temp file first, then replace atomically
                temp_path = file_path + '.tmp'
                if xmp_data:
                    resized.save(temp_path, 'JPEG', quality=88, optimize=True, xmp=xmp_data)
                else:
                    resized.save(temp_path, 'JPEG', quality=88, optimize=True)
            
            orig_size = os.path.getsize(file_path) / (1024 * 1024)
            os.replace(temp_path, file_path)
            new_size = os.path.getsize(file_path) / (1024 * 1024)
            print(f"  -> Done! {orig_size:.2f}MB -> {new_size:.2f}MB")
            optimized_count += 1
            
        except Exception as e:
            print(f"  ERROR processing {filename}: {e}")
            if os.path.exists(file_path + '.tmp'):
                os.remove(file_path + '.tmp')
                
    elapsed = time.time() - start_time
    print(f"Optimization finished in {elapsed:.1f}s. Total optimized: {optimized_count}")

if __name__ == '__main__':
    optimize_panoramas()
