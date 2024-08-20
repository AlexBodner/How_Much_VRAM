import os

def read_files_in_directory(directory='.'):
    # Iterate through all the files and subdirectories in the current directory
    for root, _, files in os.walk(directory):
        if not "\\scripts" in root and not ".\\public" in root and not ".\\node_modules" in root:
            for file in files:
                if file != "README.md"  and file!="print_files.py" and not "package" in file and file[0]!=".":
                    file_path = os.path.join(root, file)
                    # Open and read the file content
                    with open(file_path, 'r') as f:
                        content = f.read()
                    # Print the file name and its content
                    print(f"{file_path}\n\n{content}\n")

if __name__ == "__main__":
    read_files_in_directory()
