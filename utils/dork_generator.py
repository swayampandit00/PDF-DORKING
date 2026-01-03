import urllib.parse

def encode(q):
    return urllib.parse.quote(q)

def generate_queries(book):
    e = encode(book)
    queries = {
        # Basic PDF searches
        "Google PDF": f"https://www.google.com/search?q=filetype%3Apdf+%22{e}%22",
        "Google PDF Exact": f"https://www.google.com/search?q=filetype%3Apdf+intitle%3A%22{e}%22",
        "Google PDF Site EDU": f"https://www.google.com/search?q=site%3Aedu+filetype%3Apdf+%22{e}%22",
        "Google PDF Site GOV": f"https://www.google.com/search?q=site%3Agov+filetype%3Apdf+%22{e}%22",
        "Google PDF Site ORG": f"https://www.google.com/search?q=site%3Aorg+filetype%3Apdf+%22{e}%22",
        
        # Index of searches
        "Index Of PDF": f"https://www.google.com/search?q=intitle%3A%22index+of%22+%22{e}%22+pdf",
        "Index Of Parent": f"https://www.google.com/search?q=intitle%3A%22index+of%22+inurl%3A%22parent+directory%22+%22{e}%22+pdf",
        "Index Of Books": f"https://www.google.com/search?q=intitle%3A%22index+of%22+books+%22{e}%22+pdf",
        
        # Education sites
        "EDU PDF": f"https://www.google.com/search?q=site%3Aedu+%22{e}%22+filetype%3Apdf",
        "University PDF": f"https://www.google.com/search?q=site%3Aac.uk+%22{e}%22+filetype%3Apdf",
        "College PDF": f"https://www.google.com/search?q=site%3Acollege.edu+%22{e}%22+filetype%3Apdf",
        
        # Other search engines
        "DuckDuckGo PDF": f"https://duckduckgo.com/?q=filetype%3Apdf+%22{e}%22",
        "Bing PDF": f"https://www.bing.com/search?q=filetype%3Apdf+%22{e}%22",
        "Yahoo PDF": f"https://search.yahoo.com/search?q=filetype%3Apdf+%22{e}%22",
        
        # Open access
        "Open Textbook": f"https://www.google.com/search?q=%22open+textbook%22+%22{e}%22+pdf",
        "Open Access": f"https://www.google.com/search?q=%22open+access%22+%22{e}%22+pdf",
        "Free Download": f"https://www.google.com/search?q=%22free+download%22+%22{e}%22+pdf",
        
        # Archives and libraries
        "Archive.org": f"https://archive.org/search?query={e}+pdf",
        "OpenLibrary": f"https://openlibrary.org/search?q={e}",
        "Project Gutenberg": f"https://www.gutenberg.org/ebooks/search/?query={e}",
        
        # Academic
        "ResearchGate": f"https://www.researchgate.net/search?q={e}",
        "Academia.edu": f"https://www.academia.edu/search?q={e}",
        "Semantic Scholar": f"https://www.semanticscholar.org/search?q={e}",
        
        # File sharing
        "MediaFire": f"https://www.google.com/search?q=site%3Amediafire.com+%22{e}%22+pdf",
        "4Shared": f"https://www.google.com/search?q=site%3A4shared.com+%22{e}%22+pdf",
        "Zippyshare": f"https://www.google.com/search?q=site%3Azippyshare.com+%22{e}%22+pdf",
        
        # Forums and communities
        "Reddit": f"https://www.reddit.com/search?q={e}+pdf",
        "StackExchange": f"https://stackexchange.com/search?q={e}+pdf",
        
        # International
        "PDF in German": f"https://www.google.com/search?q=filetype%3Apdf+%22{e}%22+lang%3Ade",
        "PDF in French": f"https://www.google.com/search?q=filetype%3Apdf+%22{e}%22+lang%3Afr",
        "PDF in Spanish": f"https://www.google.com/search?q=filetype%3Apdf+%22{e}%22+lang%3Aes",
        
        # Advanced patterns
        "PDF Cached": f"https://www.google.com/search?q=cache%3Afiletype%3Apdf+%22{e}%22",
        "PDF Related": f"https://www.google.com/search?q=related%3Afiletype%3Apdf+%22{e}%22",
        "PDF Intext": f"https://www.google.com/search?q=intext%3A%22{e}%22+filetype%3Apdf",
        
        # More sites
        "Scribd": f"https://www.scribd.com/search?query={e}",
        "SlideShare": f"https://www.slideshare.net/search/slideshow?q={e}",
        "Issuu": f"https://issuu.com/search?q={e}",
        
        # Library catalogs
        "WorldCat": f"https://www.worldcat.org/search?qt=worldcat_org_all&q={e}",
        "Library of Congress": f"https://catalog.loc.gov/vwebv/search?searchArg={e}&searchCode=GKEY%5E*&searchType=1&recCount=25",
        
        # Additional patterns
        "PDF Book": f"https://www.google.com/search?q=%22{e}%22+book+filetype%3Apdf",
        "PDF Manual": f"https://www.google.com/search?q=%22{e}%22+manual+filetype%3Apdf",
        "PDF Guide": f"https://www.google.com/search?q=%22{e}%22+guide+filetype%3Apdf",
        "PDF Tutorial": f"https://www.google.com/search?q=%22{e}%22+tutorial+filetype%3Apdf",
        
        # More engines
        "Yandex PDF": f"https://yandex.com/search/?text=filetype%3Apdf+%22{e}%22",
        "Ecosia PDF": f"https://www.ecosia.org/search?q=filetype%3Apdf+%22{e}%22",
        
        # Specialized
        "JSTOR": f"https://www.jstor.org/action/doBasicSearch?Query={e}",
        "PubMed": f"https://pubmed.ncbi.nlm.nih.gov/?term={e}+pdf",
        
        # File types variations
        "PDF Extension": f"https://www.google.com/search?q=%22{e}%22+.pdf",
        "PDF URL": f"https://www.google.com/search?q=inurl%3A.pdf+%22{e}%22",
        
        # More international
        "PDF in Italian": f"https://www.google.com/search?q=filetype%3Apdf+%22{e}%22+lang%3Ait",
        "PDF in Portuguese": f"https://www.google.com/search?q=filetype%3Apdf+%22{e}%22+lang%3Apt",
        
        # Advanced Google
        "PDF Allintitle": f"https://www.google.com/search?q=allintitle%3A%22{e}%22+filetype%3Apdf",
        "PDF Inanchor": f"https://www.google.com/search?q=inanchor%3A%22{e}%22+filetype%3Apdf",
        
        # Additional sites
        "DocDroid": f"https://www.docdroid.net/search?q={e}",
        "PDF Drive": f"https://www.pdfdrive.com/search?q={e}",
        "PDF Book": f"https://www.pdfbook.com/search?q={e}",
        
        # Final ones to reach 50+
        "PDF Scholar": f"https://scholar.google.com/scholar?q={e}+filetype%3Apdf",
        "PDF Patent": f"https://patents.google.com/?q={e}",
        "PDF Thesis": f"https://www.google.com/search?q=%22{e}%22+thesis+filetype%3Apdf",
        "PDF Dissertation": f"https://www.google.com/search?q=%22{e}%22+dissertation+filetype%3Apdf",
        "PDF Lecture": f"https://www.google.com/search?q=%22{e}%22+lecture+notes+filetype%3Apdf"
    }
    return queries

def generate_ai_dorks(book):
    return [
        f"{book} free pdf open source",
        f"{book} university lecture notes pdf",
        f"{book} research paper filetype:pdf",
        f"{book} textbook download legally",
        f"{book} open access publication",
        f"{book} pdf download site:edu",
        f"{book} pdf mirror link",
        f"{book} digital library pdf",
        f"{book} academic pdf repository",
        f"{book} scholarly article pdf",
        f"{book} book pdf free access",
        f"{book} pdf online reading",
        f"{book} pdf direct download",
        f"{book} pdf full text",
        f"{book} pdf archive org"
    ]

def enhance_query(book):
    """AI-based query enhancer"""
    enhanced = [
        f"{book} filetype:pdf",
        f"{book} pdf download",
        f"{book} free pdf",
        f"{book} textbook pdf",
        f"{book} lecture notes pdf",
        f"{book} research paper pdf",
        f"{book} site:edu pdf",
        f"{book} site:gov pdf",
        f"{book} open access pdf",
        f"{book} academic pdf"
    ]
    return enhanced

def enhance_query(book):
    """
    AI-based query enhancement
    """
    # Simple enhancement: add common PDF search terms
    enhancements = [
        f"{book} filetype:pdf",
        f"{book} pdf download",
        f"{book} free ebook pdf",
        f"{book} textbook pdf",
        f"{book} lecture notes pdf"
    ]
    return enhancements