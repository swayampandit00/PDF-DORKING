import requests
from bs4 import BeautifulSoup
import re

def scrape_google_dorks(query, num_results=10):
    """
    Scrape Google search results for PDF links.
    Note: This is for educational purposes. Google may block automated requests.
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    url = f"https://www.google.com/search?q={query}&num={num_results}"
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        links = []
        
        # Extract PDF links from search results
        for a in soup.find_all('a', href=True):
            href = a['href']
            if href.startswith('/url?q='):
                actual_url = href.split('/url?q=')[1].split('&')[0]
                if actual_url.endswith('.pdf') or 'pdf' in actual_url.lower():
                    links.append(actual_url)
        
        return links[:num_results]
    except Exception as e:
        print(f"Error scraping: {e}")
        return []

def download_pdf(url, filename):
    """
    Download PDF from URL.
    """
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        with open(f"downloads/{filename}", 'wb') as f:
            f.write(response.content)
        return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return False