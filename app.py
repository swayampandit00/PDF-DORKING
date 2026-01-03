from flask import Flask, render_template, request, redirect, session, jsonify, send_file
from database import init_db, add_user, validate_user, save_history, get_history, get_all_users, delete_history, get_all_history, get_user_preferences, update_user_preferences, index_pdf, get_indexed_pdfs, mark_pdf_downloaded
from utils.dork_generator import generate_queries, generate_ai_dorks, enhance_query
from utils.scraper import scrape_google_dorks, download_pdf
import json
from fpdf import FPDF
import io

app = Flask(__name__)
app.secret_key = "supersecretkey"

init_db()
@app.route("/")
def home():
    if "user" not in session:
        return redirect("/login")
    return render_template("index.html")
@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]
        add_user(email, password)
        return redirect("/login")
    return render_template("signup.html")
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]
        if validate_user(email, password):
            session["user"] = email
            return redirect("/")
        else:
            return "Invalid credentials"
    return render_template("login.html")
@app.route("/logout")
def logout():
    session.pop("user", None)
    return redirect("/login")
@app.route("/search", methods=["POST"])
def search():
    if "user" not in session:
        return redirect("/login")
    book = request.form["book"]
    queries = generate_queries(book)
    ai_dorks = generate_ai_dorks(book)
    save_history(session["user"], book)
    return render_template("result.html", book=book, queries=queries, ai_dorks=ai_dorks)

@app.route("/history")
def history():
    if "user" not in session:
        return redirect("/login")
    h = get_history(session["user"])
    return render_template("history.html", history=h)
@app.route("/export/<book>/<mode>")
def export(book, mode):
    data = generate_queries(book)
    if mode == "txt":
        return "\n".join([f"{x}: {y}" for x,y in data.items()])
    if mode == "json":
        return jsonify(data)
    if mode == "pdf":
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        pdf.cell(200, 10, txt=f"PDF Dorks for: {book}", ln=True, align='C')
        pdf.ln(10)
        for title, link in data.items():
            pdf.cell(200, 10, txt=f"{title}: {link}", ln=True)
        pdf_output = io.BytesIO()
        pdf.output(pdf_output)
        pdf_output.seek(0)
        return send_file(pdf_output, as_attachment=True, download_name=f"{book}_dorks.pdf", mimetype='application/pdf')
    return "Invalid mode"
@app.route("/admin")
def admin():
    admin_emails = ["admin@.com", "swayam1@gmail.com"]  # List of admin emails
    if "user" not in session or session["user"] not in admin_emails:
        return redirect("/login")
    users = get_all_users()
    logs = get_all_history()
    return render_template("admin/dashboard/index.html", users=users, logs=logs)

# Admin section routes
@app.route("/admin/users")
def admin_users():
    admin_emails = ["admin@.com", "swayam1@gmail.com"]  # List of admin emails
    if "user" not in session or session["user"] not in admin_emails:
        return redirect("/login")
    users = get_all_users()
    return render_template("admin/users/list.html", users=users)

@app.route("/admin/logs")
def admin_logs():
    admin_emails = ["admin@.com", "swayam1@gmail.com"]  # List of admin emails
    if "user" not in session or session["user"] not in admin_emails:
        return redirect("/login")
    logs = get_all_history()
    return render_template("admin/logs/search_logs.html", logs=logs)

@app.route("/admin/settings")
def admin_settings():
    admin_emails = ["admin@.com", "swayam1@gmail.com"]  # List of admin emails
    if "user" not in session or session["user"] not in admin_emails:
        return redirect("/login")
    return render_template("admin/settings/index.html")

@app.route("/admin/templates")
def admin_templates():
    admin_emails = ["admin@.com", "swayam1@gmail.com"]  # List of admin emails
    if "user" not in session or session["user"] not in admin_emails:
        return redirect("/login")
    return render_template("admin/templates/list.html")

@app.route("/admin/ai-tools")
def admin_ai_tools():
    admin_emails = ["admin@.com", "swayam1@gmail.com"]  # List of admin emails
    if "user" not in session or session["user"] not in admin_emails:
        return redirect("/login")
    return render_template("admin/ai_tools/index.html")

@app.route("/admin/exports")
def admin_exports():
    admin_emails = ["admin@.com", "swayam1@gmail.com"]  # List of admin emails
    if "user" not in session or session["user"] not in admin_emails:
        return redirect("/login")
    return render_template("admin/exports/index.html")

@app.route("/admin/auth")
def admin_auth():
    admin_emails = ["admin@.com", "swayam1@gmail.com"]  # List of admin emails
    if "user" not in session or session["user"] not in admin_emails:
        return redirect("/login")
    return render_template("admin/auth/index.html")
@app.route('/download_pdf/<int:pdf_id>')
def download_pdf_route(pdf_id):
    if "user" not in session:
        return redirect("/login")
    
    pdfs = get_indexed_pdfs()
    if pdf_id < len(pdfs):
        url = pdfs[pdf_id][1]
        filename = f"pdf_{pdf_id}.pdf"
        if download_pdf(url, filename):
            mark_pdf_downloaded(url, filename)
            return send_file(f"downloads/{filename}", as_attachment=True)
    
    return "Download failed", 404

@app.route('/scrape/<book>')
def scrape_route(book):
    if "user" not in session:
        return redirect("/login")
    
    # Scrape for PDFs
    query = f"{book} filetype:pdf"
    pdf_links = scrape_google_dorks(query, 20)
    
    # Index them
    for i, url in enumerate(pdf_links):
        title = f"{book} PDF {i+1}"
        index_pdf(url, title)
    
    return redirect(f"/results_scraped?book={book}")

@app.route('/results_scraped')
def results_scraped():
    if "user" not in session:
        return redirect("/login")
    
    book = request.args.get('book', '')
    pdfs = get_indexed_pdfs()
    return render_template("scraped_results.html", book=book, pdfs=pdfs)

@app.route('/profile', methods=['GET', 'POST'])
def profile():
    if "user" not in session:
        return redirect("/login")
    
    if request.method == 'POST':
        theme = request.form.get('theme', 'dark')
        lang = request.form.get('lang', 'en')
        update_user_preferences(session['user'], theme, lang)
        session['lang'] = lang  # Update session
        return redirect('/profile')
    
    theme, lang = get_user_preferences(session['user'])
    return render_template('profile.html', theme=theme, lang=lang)

@app.route("/api/search")
def api_search():
    book = request.args.get("book")
    if not book:
        return jsonify({"error": "Book parameter required"}), 400
    
    queries = generate_queries(book)
    ai_dorks = generate_ai_dorks(book)
    enhanced = enhance_query(book)
    
    return jsonify({
        "book": book,
        "dorks": queries,
        "ai_suggestions": ai_dorks,
        "enhanced_queries": enhanced,
        "total_dorks": len(queries),
        "timestamp": "2025-12-30"
    })

@app.route("/api/user/history")
def api_user_history():
    if "user" not in session:
        return jsonify({"error": "Authentication required"}), 401
    
    h = get_history(session["user"])
    return jsonify({"history": [item[0] for item in h]})

@app.route("/api/scrape")
def api_scrape():
    if "user" not in session:
        return jsonify({"error": "Authentication required"}), 401
    
    book = request.args.get("book")
    if not book:
        return jsonify({"error": "Book parameter required"}), 400
    
    query = f"{book} filetype:pdf"
    pdf_links = scrape_google_dorks(query, 10)
    
    # Index them
    indexed = []
    for i, url in enumerate(pdf_links):
        title = f"{book} PDF {i+1}"
        index_pdf(url, title)
        indexed.append({"title": title, "url": url})
    
    return jsonify({"scraped_pdfs": indexed, "count": len(indexed)})

@app.route("/api/stats")
def api_stats():
    if "user" not in session:
        return jsonify({"error": "Authentication required"}), 401
    
    users_count = len(get_all_users())
    history_count = len(get_all_history())
    pdfs_count = len(get_indexed_pdfs())
    
    return jsonify({
        "total_users": users_count,
        "total_searches": history_count,
        "indexed_pdfs": pdfs_count,
        "user_searches": len(get_history(session["user"]))
    })

@app.route("/delete_history/<book>")
def delete_history_route(book):
    if "user" not in session:
        return redirect("/login")
    delete_history(session["user"], book)
    return redirect("/history")

@app.route("/clear_history")
def clear_history():
    if "user" not in session:
        return redirect("/login")
    
    # Delete all history for user
    conn = sqlite3.connect("data.db")
    c = conn.cursor()
    c.execute("DELETE FROM history WHERE email=?", (session["user"],))
    conn.commit()
    conn.close()
    
    return redirect("/history")

if __name__ == "__main__":
    app.run(host='https://pdf-dorking-production.up.railway.app', port=5000) 
    app.run(debug=True)
