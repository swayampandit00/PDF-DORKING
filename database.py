import sqlite3
def init_db():
    conn = sqlite3.connect("data.db")
    c = conn.cursor()
    c.execute("CREATE TABLE IF NOT EXISTS users (email TEXT, password TEXT)")
    c.execute("CREATE TABLE IF NOT EXISTS history (email TEXT, book TEXT)")
    c.execute("CREATE TABLE IF NOT EXISTS user_preferences (email TEXT PRIMARY KEY, theme TEXT DEFAULT 'dark', lang TEXT DEFAULT 'en')")
    c.execute("CREATE TABLE IF NOT EXISTS pdf_index (id INTEGER PRIMARY KEY, url TEXT UNIQUE, title TEXT, downloaded INTEGER DEFAULT 0, filename TEXT)")
    conn.commit()
    conn.close()

def add_user(email, password):
    conn = sqlite3.connect("data.db")
    c = conn.cursor()
    c.execute("INSERT INTO users VALUES (?, ?)", (email, password))
    conn.commit()
    conn.close()
def validate_user(email, password):
    conn = sqlite3.connect("data.db")
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE email=? AND password=?", (email, password))
    x = c.fetchone()
    conn.close()
    return x
def save_history(email, book):
    conn = sqlite3.connect("data.db")
    c = conn.cursor()
    c.execute("INSERT INTO history VALUES (?, ?)", (email, book))
    conn.commit()
    conn.close()
def get_history(email):
    conn = sqlite3.connect("data.db")
    c = conn.cursor()
    c.execute("SELECT book FROM history WHERE email=?", (email,))
    result = c.fetchall()
    conn.close()
    return result
def get_all_users():
    conn = sqlite3.connect("data.db")
    c = conn.cursor()
    c.execute("SELECT email FROM users")
    result = c.fetchall()
    conn.close()
    return result

def delete_history(email, book):
    conn = sqlite3.connect("data.db")
    c = conn.cursor()
    c.execute("DELETE FROM history WHERE email=? AND book=?", (email, book))
    conn.commit()
    conn.close()

def get_all_history():
    conn = sqlite3.connect("data.db")
    c = conn.cursor()
    c.execute("SELECT * FROM history")
    result = c.fetchall()
    conn.close()
    return result

def get_user_preferences(email):
    conn = sqlite3.connect("data.db")
    c = conn.cursor()
    c.execute("SELECT theme, lang FROM user_preferences WHERE email=?", (email,))
    result = c.fetchone()
    conn.close()
    return result or ('dark', 'en')

def update_user_preferences(email, theme, lang):
    conn = sqlite3.connect("data.db")
    c = conn.cursor()
    c.execute("INSERT OR REPLACE INTO user_preferences (email, theme, lang) VALUES (?, ?, ?)", (email, theme, lang))
    conn.commit()
    conn.close()

def index_pdf(url, title, filename=None):
    conn = sqlite3.connect("data.db")
    c = conn.cursor()
    c.execute("INSERT OR IGNORE INTO pdf_index (url, title, filename) VALUES (?, ?, ?)", (url, title, filename))
    conn.commit()
    conn.close()

def get_indexed_pdfs():
    conn = sqlite3.connect("data.db")
    c = conn.cursor()
    c.execute("SELECT * FROM pdf_index")
    result = c.fetchall()
    conn.close()
    return result

def mark_pdf_downloaded(url, filename):
    conn = sqlite3.connect("data.db")
    c = conn.cursor()
    c.execute("UPDATE pdf_index SET downloaded=1, filename=? WHERE url=?", (filename, url))
    conn.commit()
    conn.close()
