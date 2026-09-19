import os
import zlib
import struct

def find_file_in_git(repo_dir, target_file):
    index_path = os.path.join(repo_dir, '.git', 'index')
    with open(index_path, 'rb') as f:
        data = f.read()
    
    # Simple search for the file name in the index, which contains the filename
    # The format of index entry: 
    # ctime(8), mtime(8), dev(4), ino(4), mode(4), uid(4), gid(4), size(4), sha1(20), flags(2), name
    # We can just search for the filename string and then go backwards 22 bytes to get the SHA1!
    
    target_bytes = target_file.encode('utf-8')
    idx = data.find(target_bytes)
    
    if idx == -1:
        print("File not found in index")
        return None
        
    sha_offset = idx - 22
    sha_bytes = data[sha_offset:sha_offset+20]
    sha_hex = sha_bytes.hex()
    print(f"Found SHA: {sha_hex}")
    
    # Now read the object
    obj_path = os.path.join(repo_dir, '.git', 'objects', sha_hex[:2], sha_hex[2:])
    if not os.path.exists(obj_path):
        print(f"Object {obj_path} does not exist")
        return None
        
    with open(obj_path, 'rb') as f:
        compressed = f.read()
        
    uncompressed = zlib.decompress(compressed)
    
    # Format: "blob <size>\0<content>"
    null_idx = uncompressed.find(b'\0')
    content = uncompressed[null_idx+1:]
    
    return content.decode('utf-8')

if __name__ == '__main__':
    repo_dir = '.'
    target = 'src/registry/hudbirdDocsTemplates.ts'
    content = find_file_in_git(repo_dir, target)
    if content:
        with open('scratch/original_ast.ts', 'w') as f:
            f.write(content)
        print("Recovered original file to scratch/original_ast.ts")
