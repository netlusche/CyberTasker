import sys
import os

try:
    from PyPDF2 import PdfReader
    
    pdf_path = 'manuals/CyberTasker_Admin_Guide.pdf'
    if not os.path.exists(pdf_path):
        print(f"Error: {pdf_path} not found.")
        sys.exit(1)
        
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n\n"
        
    print(text)
    
except ImportError:
    print("PyPDF2 is not installed. Will try another method or ask user.")
