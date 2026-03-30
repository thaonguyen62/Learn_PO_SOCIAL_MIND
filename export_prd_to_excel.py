"""
Export SocialMind_PRD_v2.1.md to Excel
Each major section becomes a separate sheet.
"""

import re
from openpyxl import Workbook
from openpyxl.styles import (
    Font, PatternFill, Alignment, Border, Side
)
from openpyxl.utils import get_column_letter

# ── Colours ──────────────────────────────────────────────────────────────────
C_DARK   = "1F3864"   # dark navy  – sheet headers
C_MID    = "2E75B6"   # blue       – section headers
C_LIGHT  = "BDD7EE"   # light blue – column headers
C_YELLOW = "FFE699"   # yellow     – must-have
C_GREEN  = "E2EFDA"   # green      – row alternation
C_WHITE  = "FFFFFF"

# ── Helpers ───────────────────────────────────────────────────────────────────

def thin_border():
    s = Side(style="thin", color="AAAAAA")
    return Border(left=s, right=s, top=s, bottom=s)

def style_header_row(ws, row_num, n_cols, fill_color=C_MID, font_color=C_WHITE, font_size=11):
    fill = PatternFill("solid", fgColor=fill_color)
    font = Font(bold=True, color=font_color, size=font_size)
    for col in range(1, n_cols + 1):
        cell = ws.cell(row=row_num, column=col)
        cell.fill = fill
        cell.font = font
        cell.alignment = Alignment(wrap_text=True, vertical="center", horizontal="center")
        cell.border = thin_border()

def style_data_row(ws, row_num, n_cols, alt=False):
    fill = PatternFill("solid", fgColor=C_GREEN if alt else C_WHITE)
    for col in range(1, n_cols + 1):
        cell = ws.cell(row=row_num, column=col)
        cell.fill = fill
        cell.alignment = Alignment(wrap_text=True, vertical="top")
        cell.border = thin_border()

def write_table(ws, start_row, headers, rows, col_widths=None):
    """Write a table starting at start_row. Returns next free row."""
    n = len(headers)
    for ci, h in enumerate(headers, 1):
        ws.cell(row=start_row, column=ci, value=h)
    style_header_row(ws, start_row, n, C_LIGHT, C_DARK)

    for ri, row in enumerate(rows):
        r = start_row + 1 + ri
        for ci, val in enumerate(row, 1):
            ws.cell(row=r, column=ci, value=val)
        style_data_row(ws, r, n, alt=(ri % 2 == 1))

    if col_widths:
        for ci, w in enumerate(col_widths, 1):
            ws.column_dimensions[get_column_letter(ci)].width = w

    return start_row + 1 + len(rows) + 1

def section_title(ws, row_num, title, n_cols=6):
    ws.merge_cells(start_row=row_num, start_column=1,
                   end_row=row_num, end_column=n_cols)
    cell = ws.cell(row=row_num, column=1, value=title)
    cell.fill = PatternFill("solid", fgColor=C_MID)
    cell.font = Font(bold=True, color=C_WHITE, size=12)
    cell.alignment = Alignment(horizontal="left", vertical="center")
    ws.row_dimensions[row_num].height = 22
    return row_num + 1

def sheet_title(ws, title):
    ws.merge_cells("A1:F1")
    cell = ws["A1"]
    cell.value = title
    cell.fill = PatternFill("solid", fgColor=C_DARK)
    cell.font = Font(bold=True, color=C_WHITE, size=14)
    cell.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[1].height = 30
    return 3   # next row


# ── Parse helpers ─────────────────────────────────────────────────────────────

def strip_md(text):
    """Remove bold/italic/backtick markdown, strip extra spaces."""
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    text = re.sub(r'\*(.*?)\*', r'\1', text)
    text = re.sub(r'`(.*?)`', r'\1', text)
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)  # links
    return text.strip()

def parse_md_table(lines):
    """Parse markdown table lines into (headers, rows)."""
    table_lines = [l for l in lines if l.strip().startswith("|")]
    if len(table_lines) < 2:
        return [], []
    headers = [strip_md(c) for c in table_lines[0].split("|")[1:-1]]
    rows = []
    for line in table_lines[2:]:
        cells = [strip_md(c) for c in line.split("|")[1:-1]]
        if cells:
            rows.append(cells)
    return headers, rows


# ═══════════════════════════════════════════════════════════════════════════════
# BUILD WORKBOOK
# ═══════════════════════════════════════════════════════════════════════════════

wb = Workbook()
wb.remove(wb.active)   # remove default sheet


# ── 1. OVERVIEW ────────────────────────────────────────────────────────────────
ws = wb.create_sheet("01 · Overview")
r = sheet_title(ws, "SocialMind PRD v2.1 — Overview")
r = section_title(ws, r, "Product Identity", 4)

meta = [
    ("Product Name",   "SocialMind — Agentic Social Intelligence"),
    ("Version",        "v2.1 · MVP Final"),
    ("Status",         "Draft — In Review"),
    ("Target Launch",  "Q2 2026"),
    ("Platform",       "Web App (SaaS) + Telegram"),
    ("Last Updated",   "March 2026"),
    ("Author",         "Product Owner"),
]
for label, value in meta:
    ws.cell(row=r, column=1, value=label).font = Font(bold=True)
    ws.cell(row=r, column=2, value=value)
    r += 1

r += 1
r = section_title(ws, r, "Value Proposition", 4)
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=4)
ws.cell(row=r, column=1,
        value="Biến hàng ngàn social posts và internal research thành business insight rõ ràng "
              "— theo yêu cầu hoặc liên tục tự động, không cần setup phức tạp.")
ws.cell(row=r, column=1).alignment = Alignment(wrap_text=True)
ws.row_dimensions[r].height = 40
r += 2

r = section_title(ws, r, "Two Modes", 4)
modes = [
    ("Insight Mode", "On-demand W-N-P Analysis",
     "User kích hoạt khi cần. Thu thập data → W-N-P phân loại → Report + PDF trong < 5 phút."),
    ("Watch Mode", "Always-on Monitoring & Alerts",
     "Chạy nền 24/7, scrape mỗi 60 phút, phát hiện spike, Telegram alert < 30 phút + daily briefing 8:00 AM."),
]
r = write_table(ws, r,
    ["Mode", "Type", "Description"],
    modes,
    col_widths=[18, 28, 55])

ws.column_dimensions["A"].width = 18
ws.column_dimensions["B"].width = 28
ws.column_dimensions["C"].width = 55


# ── 2. PROBLEM STATEMENT ──────────────────────────────────────────────────────
ws = wb.create_sheet("02 · Problem")
r = sheet_title(ws, "Problem Statement")
r = section_title(ws, r, "Ba vấn đề — Một sản phẩm giải quyết", 5)

prob_headers = ["Vấn đề", "Ai bị ảnh hưởng", "Hậu quả", "Mode giải quyết"]
prob_rows = [
    ("Research thủ công, chậm và thiếu structure. Scroll FB/TikTok/Reddit tốn 3–5 giờ/tuần.",
     "Marketing Manager, Product Owner",
     "Ra quyết định dựa trên cảm tính. Discovery mất 2–4 tuần.",
     "Insight Mode (Social)"),
    ("Khủng hoảng xảy ra ngoài giờ hành chính. Brand Manager biết khi sếp gọi.",
     "Brand Manager, Marketing Manager",
     "Phản ứng chậm với crisis. Bỏ lỡ trend.",
     "Watch Mode"),
    ("Xử lý internal research thủ công. Tốn 1+ ngày tổng hợp 300–400 feedback/sprint.",
     "Product Owner, Designer",
     "Feature bị lệch. Sprint bị lãng phí.",
     "Insight Mode (File Upload)"),
    ("Không có tool phù hợp thị trường Việt Nam. Brandwatch không cover FB/TikTok VN.",
     "Cả ba persona",
     "Bỏ phí license hoặc quay về manual.",
     "Cả hai mode"),
]
r = write_table(ws, r, prob_headers, prob_rows, [40, 28, 38, 25])

r += 1
r = section_title(ws, r, "Core Problem", 5)
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=5)
ws.cell(row=r, column=1,
        value="Không có sản phẩm nào trên thị trường VN cung cấp agentic social listening kết hợp "
              "on-demand insight, real-time monitoring, và internal research synthesis — "
              "phù hợp với Facebook, TikTok, Threads và báo điện tử Việt Nam.")
ws.cell(row=r, column=1).alignment = Alignment(wrap_text=True)
ws.cell(row=r, column=1).font = Font(bold=True, italic=True)
ws.row_dimensions[r].height = 50


# ── 3. PERSONAS ───────────────────────────────────────────────────────────────
ws = wb.create_sheet("03 · Personas")
r = sheet_title(ws, "Target Users & Personas")

persona_headers = ["Persona", "Role", "Priority", "Context", "Goal", "Pain", "Mode", "Budget/tháng"]
persona_rows = [
    ("Mai Nguyễn", "Marketing Manager", "PRIMARY",
     "D2C startup F&B, team 3 người, HCMC",
     "Hiểu KH đang nói gì để điều chỉnh campaign, phản ứng kịp thị trường",
     "Research thủ công tốn thời gian. Không có alert khi brand bị mention bất thường.",
     "Insight + Watch", "$30–80"),
    ("Minh Trần", "Product Owner", "SECONDARY",
     "SaaS startup Series A, team product 5 người",
     "Validate product ideas, lấy evidence-backed insight để thuyết phục stakeholder về roadmap",
     "Discovery tốn 2–3 tuần. Tốn 1+ ngày tổng hợp 300–400 feedback mỗi sprint.",
     "Insight Mode (Social + File Upload)", "$50–150"),
    ("Linh Phạm", "Brand Manager", "SECONDARY",
     "Công ty FMCG, 28 tuổi, HCMC",
     "Biết ngay khi có crisis. Summary để báo cáo sếp thứ Hai.",
     "Biết có khủng hoảng khi sếp gọi. Check thủ công 1.5h/sáng.",
     "Watch Mode", "$25–60"),
    ("Designer", "Designer", "SECONDARY (Internal)",
     "Member trong product team, cùng team với Minh Trần",
     "Thấy clustered pain points từ UT và interviews để iterate UI",
     "Phải đợi PM tổng hợp feedback — không có visibility trực tiếp vào data",
     "Insight Mode (nhận report từ File Upload)", "Không trả riêng"),
]
r = write_table(ws, r, persona_headers, persona_rows,
    [15, 22, 20, 35, 45, 48, 35, 15])


# ── 4. JTBD ───────────────────────────────────────────────────────────────────
ws = wb.create_sheet("04 · JTBD")
r = sheet_title(ws, "Jobs To Be Done (JTBD)")

jtbd_headers = ["Khi nào", "Tôi muốn", "Để tôi có thể", "Mode"]
jtbd_rows = [
    ("Trước khi lên campaign mới",
     "Biết KH đang nói gì về category — Wants, Needs, Pains",
     "Tạo messaging phù hợp pain thực sự, không phải assumption",
     "Insight (Social)"),
    ("Khi chuẩn bị roadmap quarter mới",
     "Có evidence-backed insight với quotes thuyết phục",
     "Prioritize feature với data thực, không phải cảm tính",
     "Insight (Social)"),
    ("Sau mỗi sprint UT hoặc user interview",
     "Upload file feedback và nhận report tự động trong ngày",
     "Ra quyết định backlog dựa trên data, không mất 1+ ngày tổng hợp",
     "Insight (File Upload)"),
    ("Khi bắt đầu ngày làm việc",
     "Biết ngay điều gì quan trọng xảy ra với brand trong 24h qua",
     "Phản ứng kịp thay vì biết muộn qua người khác",
     "Watch"),
    ("Khi có sự kiện thị trường (trend, scandal)",
     "Nhận alert trong vòng 30 phút khi có spike bất thường",
     "Phản ứng với crisis trước khi nó leo thang",
     "Watch"),
    ("Khi thấy alert spike bất thường",
     "Deep dive ngay vào insight để hiểu root cause",
     "Ra quyết định hành động cụ thể, không chỉ biết 'có vấn đề'",
     "Cả hai"),
    ("Khi muốn pitch ý tưởng với ban lãnh đạo",
     "Có report chuyên nghiệp với chart và evidence quotes",
     "Present mà không cần team research riêng",
     "Insight"),
]
r = write_table(ws, r, jtbd_headers, jtbd_rows, [35, 48, 50, 20])


# ── 5. SUCCESS METRICS ────────────────────────────────────────────────────────
ws = wb.create_sheet("05 · Metrics")
r = sheet_title(ws, "Success Metrics")

r = section_title(ws, r, "North Star Metric", 5)
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=5)
ns = ws.cell(row=r, column=1,
    value="'Insights Acted Upon per Month' — số lần user export PDF (Insight Mode) hoặc click "
          "'Deep Dive' / view full context từ Telegram alert (Watch Mode).")
ns.alignment = Alignment(wrap_text=True)
ns.font = Font(bold=True)
ws.row_dimensions[r].height = 40
r += 2

metrics_headers = ["Metric", "Baseline", "Target (3 tháng)", "Đo bằng cách nào"]
metrics_rows = [
    ("Time-to-first-insight (Social)", "Manual: 3–5 giờ", "< 5 phút", "Pipeline completion time tracking"),
    ("Internal feedback processing time", "Manual: 1+ ngày", "< 2 giờ", "Pipeline completion time"),
    ("Alert latency (Watch)", "Phát hiện muộn / không phát hiện", "< 30 phút", "Timestamp spike detection → Telegram delivery"),
    ("Weekly active analyses", "0", "10+ analyses/tuần", "App analytics"),
    ("Watch Mode activation rate", "—", "≥ 60% paid users setup ≥ 1 monitor", "Monitor creation events"),
    ("PDF export rate", "—", "≥ 60% sessions có export", "Export button click tracking"),
    ("Daily briefing delivery accuracy", "—", "8:00 ± 5 phút, ≥ 5 ngày liên tiếp", "Telegram delivery timestamp"),
    ("Data-driven decisions (PM)", "~30% decisions có data", "≥ 50%", "Backlog items tagged with feedback source"),
    ("D7 Retention", "—", "≥ 30%", "Return visits tracking"),
    ("Usability score (SUS)", "—", "≥ 75/100", "5 user test sessions"),
    ("Sentiment accuracy", "—", "> 75%", "Claude API phân loại đúng trên 50 post test tiếng Việt"),
]
r = write_table(ws, r, metrics_headers, metrics_rows, [38, 28, 40, 48])


# ── 6. SCOPE ──────────────────────────────────────────────────────────────────
ws = wb.create_sheet("06 · Scope")
r = sheet_title(ws, "Scope — In / Out of V1")

scope_in = [
    ("Insight Mode — Social", "Business context agent (multi-turn Q&A, max 5 câu)", "Must", "V1"),
    ("Insight Mode — Social", "Scraping: Facebook Groups, TikTok, Threads, Reddit, Báo chí", "Must", "V1"),
    ("Insight Mode — Social", "W-N-P classification bằng Claude API", "Must", "V1"),
    ("Insight Mode — Social", "Insight report: top 5/category + evidence quotes + chart", "Must", "V1"),
    ("Insight Mode — Social", "PDF export chuyên nghiệp", "Must", "V1"),
    ("Insight Mode — Social", "Job history (xem lại các analysis cũ)", "Must", "V1"),
    ("Insight Mode — File Upload", "Email listener tự động detect file attachment", "Must", "V1"),
    ("Insight Mode — File Upload", "Parse Excel/CSV feedback (300–400 rows)", "Must", "V1"),
    ("Insight Mode — File Upload", "Sentiment analysis + theme clustering từ internal data", "Must", "V1"),
    ("Insight Mode — File Upload", "Auto insight report (same format as Social flow)", "Must", "V1"),
    ("Insight Mode — File Upload", "Telegram alert khi negative items ≥ 20", "Must", "V1"),
    ("Watch Mode", "Monitor config: keywords + 2 platforms (FB Page + TikTok)", "Must", "V1"),
    ("Watch Mode", "Spike detection (3× volume so với trung bình 7 ngày)", "Must", "V1"),
    ("Watch Mode", "Real-time Telegram alert (< 30 phút) — Option B format", "Must", "V1"),
    ("Watch Mode", "Daily briefing tự động 8:00 sáng qua Telegram", "Must", "V1"),
    ("Watch Mode", "Guided Telegram bot connection flow với test message", "Must", "V1"),
    ("Shared", "Web App (React + FastAPI)", "Must", "V1"),
    ("Shared", "User authentication cơ bản", "Must", "V1"),
    ("Shared", "Usage dashboard (Apify credits + Claude tokens)", "Must", "V1"),
    ("Shared", "'Deep Dive' cross-mode flow", "Must", "V1"),
    ("Shared", "Stripe subscription (Checkout hosted)", "Must", "V1"),
]
scope_out = [
    ("Twitter/X scraping", "API cost cao, low priority VN market", "Out of V1"),
    ("Multi-brand monitoring", "Watch Mode chỉ 1 brand", "Out of V1"),
    ("Google Slides export", "Chỉ PDF trong V1", "Out of V1"),
    ("Team collaboration / shared workspace", "Deferred", "Out of V1"),
    ("Real-time streaming dashboard", "Telegram là interface Watch", "Out of V1"),
    ("Competitor comparison report", "V2", "Out of V1"),
    ("Weekly Watch Mode report", "V1 chỉ có daily briefing", "Out of V1"),
    ("Slack delivery channel", "Chỉ Telegram trong V1", "Out of V1"),
    ("API access cho third-party", "V2+", "Out of V1"),
    ("Mobile app", "V2+", "Out of V1"),
    ("Niche Finder / Solution Engine", "V2", "Out of V1"),
    ("White-label / agency mode", "V2+", "Out of V1"),
    ("Interview transcript analysis (.docx, audio)", "V2 — chỉ Excel/CSV trong V1", "Out of V1"),
]

r = section_title(ws, r, "✅ IN SCOPE — V1", 4)
r = write_table(ws, r,
    ["Area", "Feature", "Priority", "Version"],
    scope_in, [28, 55, 12, 10])

r = section_title(ws, r, "❌ OUT OF SCOPE — V1", 4)
r = write_table(ws, r,
    ["Feature", "Reason", "Status"],
    scope_out, [35, 50, 14])


# ── 7. USER STORIES ───────────────────────────────────────────────────────────
ws = wb.create_sheet("07 · User Stories")
r = sheet_title(ws, "User Stories & Acceptance Criteria")

us_headers = ["ID", "Mode", "Priority", "As a...", "I want to...", "So that...", "Acceptance Criteria"]
us_rows = [
    ("US-001", "Insight Mode", "Must",
     "Marketing Manager",
     "Khai báo brand và câu hỏi nghiên cứu qua chat interface thay vì điền form",
     "Agent hiểu đúng context và phân tích data relevant với business của tôi",
     "• Agent hỏi tối đa 5 câu có cấu trúc: brand name, industry, ICP, competitors, research question\n"
     "• User có thể skip bất kỳ câu nào\n"
     "• System hiển thị context summary card để user confirm\n"
     "• Toàn bộ Q&A hoàn thành dưới 3 phút"),
    ("US-002", "Insight Mode", "Must",
     "Product Owner",
     "Thấy tiến trình thu thập data real-time",
     "Tôi biết hệ thống đang hoạt động và không bỏ cuộc giữa chừng",
     "• Hiển thị số posts đã thu thập, platform đang scrape, và ETA\n"
     "• Nếu quá 3 phút không cập nhật, hiển thị trạng thái rõ ràng\n"
     "• User có thể cancel và restart mà không mất context\n"
     "• Nếu một platform fail, job tiếp tục với các platform còn lại"),
    ("US-003", "Insight Mode", "Must",
     "Marketing Manager",
     "Xem báo cáo phân loại Wants / Needs / Pains với chart và evidence quotes",
     "Tôi có data thuyết phục để trình bày với stakeholder",
     "• Report hiển thị top 5 insights cho mỗi nhóm W/N/P\n"
     "• Mỗi insight có ≥ 2 verbatim quotes kèm platform source và post date\n"
     "• Chart hiển thị volume và % phân bổ W/N/P\n"
     "• Tổng thời gian onboarding → report hoàn chỉnh < 5 phút"),
    ("US-004", "Insight Mode", "Must",
     "Product Owner",
     "Export report ra file PDF chuyên nghiệp",
     "Tôi có thể gửi cho stakeholder mà không cần chỉnh sửa thêm",
     "• PDF gồm: cover page, executive summary, W-N-P charts, top insights, evidence quotes, source list\n"
     "• File generate trong dưới 60 giây sau khi click export\n"
     "• File name format: SocialMind_[BrandName]_[YYYY-MM-DD].pdf\n"
     "• PDF readable trên cả desktop và mobile"),
    ("US-005", "Watch Mode", "Must",
     "Brand Manager",
     "Setup monitor với guided flow và test Telegram connection trước khi activate",
     "Tôi không phát hiện bot bị misconfigure chỉ khi miss alert thật",
     "• Setup flow: keywords → platforms → sensitivity threshold → Telegram Chat ID\n"
     "• System gửi test message sau khi user nhập Chat ID\n"
     "• User phải confirm receipt trong web UI trước khi monitor activate\n"
     "• Nếu test message fail, UI hiển thị lỗi cụ thể\n"
     "• Monitor có thể pause/resume"),
    ("US-006", "Watch Mode", "Must",
     "Brand Manager",
     "Nhận Telegram alert trong vòng 30 phút khi có spike bất thường về brand mentions",
     "Tôi không phải là người cuối cùng biết khi crisis xảy ra",
     "• Alert trigger khi volume 1 giờ vượt threshold (default 3x trung bình 7 ngày)\n"
     "• Alert format Option B: spike magnitude + top issue + sentiment breakdown + report link\n"
     "• Alert delivered trong 30 phút kể từ khi spike window đóng\n"
     "• User có thể chọn sensitivity: High (1.5x), Medium (3x), Low (5x)"),
    ("US-007", "Watch Mode", "Must",
     "Brand Manager",
     "Nhận daily briefing 8:00 sáng mỗi ngày tóm tắt 24h qua",
     "Tôi có situational awareness ngay từ đầu ngày mà không cần check thủ công",
     "• Briefing đến 8:00–8:05 AM Vietnam time (UTC+7) mỗi ngày\n"
     "• Nội dung: total mentions, sentiment ratio, top post, 1 notable trend viết tiếng Việt\n"
     "• Nếu không có mentions, gửi 'Không có hoạt động đáng chú ý'\n"
     "• Chạy ổn định ≥ 5 ngày liên tiếp không cần can thiệp thủ công"),
    ("US-008", "Cross-Mode", "Must",
     "Marketing Manager (dùng cả hai modes)",
     "Click 'Deep Dive' từ Watch alert để launch Insight scan ngay trên topic đó",
     "Tôi chuyển từ 'biết có vấn đề' sang 'hiểu root cause' mà không cần nhập lại context",
     "• 'Deep Dive' action mở web app với Insight Mode pre-fill brand + spike topic\n"
     "• User chỉ cần confirm hoặc adjust — không nhập lại từ đầu\n"
     "• Insight report kết quả linked back về alert gốc\n"
     "• Dashboard cập nhật trong vòng 5 phút sau khi job hoàn thành"),
    ("US-009", "Cross-Mode", "Must",
     "Startup founder quản lý chi phí",
     "Thấy usage dashboard hiển thị Apify credits và Claude tokens đã dùng",
     "Tôi không bị bất ngờ bởi overage charge",
     "• Hiển thị: credits used / credits included, estimated cost, projection end-of-month\n"
     "• Gửi Telegram hoặc email warning khi đạt 80% usage"),
    ("US-010", "Insight Mode", "Must",
     "Product Owner",
     "Gửi file Excel feedback qua email và nhận insight report tự động trong cùng ngày",
     "Tôi ra quyết định backlog dựa trên data thay vì mất 1+ ngày tổng hợp thủ công",
     "• System tự động detect email attachment — không cần manual upload\n"
     "• Hỗ trợ format: .xlsx, .xls, .csv\n"
     "• Xử lý 300–400 feedback rows trong dưới 2 giờ\n"
     "• Report gồm: top themes, sentiment breakdown, top 5 pain points với verbatim quotes\n"
     "• Nếu negative items ≥ 20: gửi Telegram alert Option B\n"
     "• Zero manual steps sau khi gửi email\n"
     "• Raw file không được lưu sau khi parse xong (privacy)"),
    ("US-011", "Insight Mode", "Must",
     "Designer trong product team",
     "Xem clustered pain points từ UT và user interview feedback",
     "Tôi biết UI flow nào cần iterate trong sprint tới mà không cần đợi PM tổng hợp",
     "• Report hiển thị pain points được group theo UI area / feature area\n"
     "• Mỗi cluster có số lượng mentions và severity score\n"
     "• Designer có thể access report qua shared link (không cần account riêng trong V1)"),
    ("US-012", "Onboarding", "Must",
     "Starter user mới đăng ký",
     "Được dẫn thẳng vào Insight Mode ngay sau khi đăng ký",
     "Tôi tạo ra giá trị đầu tiên mà không phải quyết định giữa các mode tôi chưa hiểu",
     "• Starter user không thấy Watch Mode ở bất kỳ UI element nào\n"
     "• Bước đầu tiên là nhập business context — không phải chọn mode\n"
     "• Time-to-first-insight ≤ 3 clicks kể từ lúc đăng ký\n"
     "• Upsell Watch chỉ xuất hiện sau khi user đã export ≥ 1 PDF report"),
    ("US-013", "Onboarding", "Must",
     "Growth+ user mới đăng ký",
     "Chọn mục đích sử dụng ngay lần đầu",
     "App dẫn tôi đến đúng mode phù hợp với công việc hiện tại",
     "• Sau đăng ký thấy 1 screen duy nhất với 2 lựa chọn: 'Phân tích' hoặc 'Theo dõi'\n"
     "• Chọn 'Phân tích' → Insight Mode business context flow\n"
     "• Chọn 'Theo dõi' → Watch Mode monitor setup flow\n"
     "• User có thể đổi lựa chọn bất kỳ lúc nào từ sidebar"),
]
r = write_table(ws, r, us_headers, us_rows, [10, 18, 12, 25, 45, 45, 60])
for row in ws.iter_rows(min_row=3):
    ws.row_dimensions[row[0].row].height = 80


# ── 8. MoSCoW ─────────────────────────────────────────────────────────────────
ws = wb.create_sheet("08 · MoSCoW")
r = sheet_title(ws, "MoSCoW Prioritization")

moscow_headers = ["Priority", "Feature", "Category", "Note"]

must = [
    ("Must Have", "Business context agent (multi-turn, max 5Q)", "Insight Mode", ""),
    ("Must Have", "Apify scraping: FB Groups, TikTok, Threads, Reddit, News", "Insight Mode", ""),
    ("Must Have", "W-N-P classification (Claude Sonnet)", "Insight Mode", ""),
    ("Must Have", "Insight report với top findings + evidence quotes", "Insight Mode", ""),
    ("Must Have", "PDF export", "Insight Mode", ""),
    ("Must Have", "Job history & saved reports", "Insight Mode", ""),
    ("Must Have", "Email attachment listener (auto-trigger)", "Insight Mode – File Upload", "Bổ sung v2.1"),
    ("Must Have", "Internal Excel/CSV file parser", "Insight Mode – File Upload", "Bổ sung v2.1"),
    ("Must Have", "Sentiment + clustering cho internal feedback", "Insight Mode – File Upload", "Bổ sung v2.1"),
    ("Must Have", "Watch Mode monitor config (FB Page + TikTok)", "Watch Mode", ""),
    ("Must Have", "Spike detection + Telegram alert (<30 phút)", "Watch Mode", "Option B format"),
    ("Must Have", "Daily briefing 8:00 AM qua Telegram", "Watch Mode", ""),
    ("Must Have", "Telegram bot guided setup + test message", "Watch Mode", ""),
    ("Must Have", "'Deep Dive' cross-mode flow", "Shared", ""),
    ("Must Have", "Usage dashboard (credits + tokens)", "Shared", ""),
    ("Must Have", "User authentication + Stripe subscription", "Shared", ""),
    ("Should Have", "Sentiment trend chart theo thời gian", "Insight", "V1 nếu kịp"),
    ("Should Have", "Weekly Watch Mode report qua Telegram", "Watch Mode", "V1 nếu kịp"),
    ("Should Have", "Re-run Insight job với pre-filled parameters", "Insight", "V1 nếu kịp"),
    ("Should Have", "Email fallback khi Telegram alert fail", "Watch Mode", "V1 nếu kịp"),
    ("Should Have", "Insight quality feedback (thumbs up/down)", "Insight", "V1 nếu kịp"),
    ("Should Have", "Alert sensitivity per monitor", "Watch Mode", "V1 nếu kịp"),
    ("Should Have", "Alert history trong web app", "Watch Mode", "V1 nếu kịp"),
    ("Should Have", "Slack delivery cho File Upload alerts", "File Upload", "Bổ sung v2.1"),
    ("Could Have", "Competitor comparison report", "Insight", "V2"),
    ("Could Have", "Multi-brand monitoring", "Watch", "V2"),
    ("Could Have", "Slack delivery channel", "Shared", "V2"),
    ("Could Have", "Google Slides export", "Insight", "V2"),
    ("Could Have", "Email report scheduling", "Shared", "V2"),
    ("Could Have", "Team workspace (invite members)", "Shared", "V2"),
    ("Could Have", "Twitter/X scraping", "Data", "V2"),
    ("Could Have", "Custom alert rules (sentiment-based)", "Watch", "V2"),
    ("Could Have", "Custom PDF branding", "Insight", "V2"),
    ("Could Have", "Niche Finder / Gap scoring algorithm", "AI", "V2"),
    ("Could Have", "Interview transcript analysis (.docx, audio)", "File Upload", "V2 – Bổ sung v2.1"),
    ("Won't Have", "Real-time streaming dashboard", "Watch", "Not this version"),
    ("Won't Have", "Mobile app (iOS/Android)", "Platform", "Not this version"),
    ("Won't Have", "API access for third-party", "Platform", "Not this version"),
    ("Won't Have", "White-label / agency mode", "Platform", "Not this version"),
    ("Won't Have", "CRM integration (Salesforce, HubSpot)", "Integration", "Not this version"),
    ("Won't Have", "LinkedIn scraping", "Data", "Not this version"),
    ("Won't Have", "AI-generated response suggestions", "AI", "Not this version"),
    ("Won't Have", "Data retention > 90 days", "Compliance", "Not this version"),
]

# Write with colour-coded priority
priority_colours = {
    "Must Have":   "FF0000",
    "Should Have": "FFC000",
    "Could Have":  "5B9BD5",
    "Won't Have":  "808080",
}

ws.cell(row=r, column=1, value="Priority").font = Font(bold=True)
ws.cell(row=r, column=2, value="Feature").font = Font(bold=True)
ws.cell(row=r, column=3, value="Category").font = Font(bold=True)
ws.cell(row=r, column=4, value="Note").font = Font(bold=True)
style_header_row(ws, r, 4, C_LIGHT, C_DARK)
r += 1

for i, (priority, feature, cat, note) in enumerate(must):
    ws.cell(row=r, column=1, value=priority)
    ws.cell(row=r, column=2, value=feature)
    ws.cell(row=r, column=3, value=cat)
    ws.cell(row=r, column=4, value=note)
    colour = priority_colours.get(priority, C_WHITE)
    ws.cell(row=r, column=1).fill = PatternFill("solid", fgColor=colour)
    ws.cell(row=r, column=1).font = Font(bold=True, color=C_WHITE)
    style_data_row(ws, r, 4, alt=(i % 2 == 1))
    ws.cell(row=r, column=1).fill = PatternFill("solid", fgColor=colour)
    ws.cell(row=r, column=1).font = Font(bold=True, color=C_WHITE)
    r += 1

ws.column_dimensions["A"].width = 16
ws.column_dimensions["B"].width = 55
ws.column_dimensions["C"].width = 28
ws.column_dimensions["D"].width = 18


# ── 9. TECH STACK ─────────────────────────────────────────────────────────────
ws = wb.create_sheet("09 · Tech Stack")
r = sheet_title(ws, "Tech Stack & Architecture")

tech_headers = ["Component", "Technology", "Lý do"]
tech_rows = [
    ("Frontend", "React 18 + TypeScript + shadcn/ui (Tailwind) + Recharts", "Build UI nhanh. Recharts tương thích PDF."),
    ("Backend", "FastAPI (Python)", "Async performance tốt. Python ecosystem phù hợp AI/scraping."),
    ("Watch Orchestrator", "n8n (self-hosted)", "Visual workflow, built-in cron, retry, Telegram node. Không cần code scheduler."),
    ("Email Listener", "FastAPI + IMAP/SMTP (Python imaplib)", "Auto-detect attachment. Simple integration với existing FastAPI."),
    ("Data Acquisition", "Apify Platform", "Managed actors, shared pool cả 2 modes."),
    ("AI — Insight", "Claude Sonnet", "Deep W-N-P synthesis + internal feedback clustering. 200K tokens/job."),
    ("AI — Watch", "Claude Haiku", "Cost-efficient sentiment scoring. 720 runs/tháng."),
    ("Database", "PostgreSQL (Supabase)", "Managed DB + Auth + Storage. 90-day TTL raw posts."),
    ("Delivery", "Telegram Bot API", "Phổ biến tại VN. n8n built-in node."),
    ("Payment", "Stripe Checkout", "Minimal integration. Đủ cho V1."),
    ("Hosting", "Vercel (Frontend) + Railway (FastAPI + n8n + PostgreSQL)", "Free tier + usage-based. Phù hợp MVP."),
    ("Monitoring", "GitHub Actions + Sentry + Uptime Robot", "Watch Mode always-on — alert ngay khi n8n fail."),
]
r = write_table(ws, r, tech_headers, tech_rows, [28, 50, 55])

r += 1
r = section_title(ws, r, "Estimated Infrastructure Cost per User (Growth tier, Watch Mode active)", 4)
cost_headers = ["Service", "Usage", "Cost/tháng"]
cost_rows = [
    ("Apify", "Hourly Watch scrape (2 platforms) + 4 Insight runs", "~$10"),
    ("Claude API", "Haiku Watch (720 runs × 10K tokens) + Sonnet Insight (4 × 200K tokens)", "~$7"),
    ("Infrastructure share", "Railway, Vercel, Supabase — amortized across users", "~$3"),
    ("TOTAL cost/user", "", "~$20/tháng"),
]
r = write_table(ws, r, cost_headers, cost_rows, [25, 58, 18])

r += 1
r = section_title(ws, r, "Architecture Note", 4)
arch_note = ("Growth tier pricing $59/tháng → gross margin ~66% per user. "
             "Watch Mode-only users on Starter tier ($25) tạo ra negative margin — "
             "Watch Mode phải được gated từ Growth tier trở lên.")
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=4)
cell = ws.cell(row=r, column=1, value=arch_note)
cell.alignment = Alignment(wrap_text=True)
cell.font = Font(italic=True)
ws.row_dimensions[r].height = 50


# ── 10. PRICING ───────────────────────────────────────────────────────────────
ws = wb.create_sheet("10 · Pricing")
r = sheet_title(ws, "Pricing & Packaging")

pricing_headers = ["Feature", "Starter ($25/tháng)", "Growth — ⭐ ($59/tháng)", "Pro ($129/tháng)"]
pricing_rows = [
    ("Positioning",              "Insight only",         "Most popular",          "Power users"),
    ("Insight Mode scans",       "10/tháng",             "Unlimited",             "Unlimited"),
    ("Platforms",                "5 (FB, TikTok, Threads, Reddit, News)", "5 platforms", "5 platforms"),
    ("W-N-P report + PDF",       "✓",                    "✓",                     "✓"),
    ("File Upload (Excel/CSV)",  "5 files/tháng",        "Unlimited",             "Unlimited"),
    ("Job history",              "30 ngày",              "90 ngày",               "90 ngày"),
    ("Watch Mode",               "✗",                    "1 active monitor",      "3 active monitors"),
    ("Telegram alerts",          "✗",                    "✓",                     "✓"),
    ("Daily briefing",           "✗",                    "✓",                     "✓"),
    ("'Deep Dive' flow",         "✗",                    "✓",                     "✓"),
    ("Weekly auto Watch report", "✗",                    "✗",                     "✓"),
    ("Competitor comparison",    "✗",                    "✗",                     "V1.5"),
    ("Custom sensitivity rules", "✗",                    "✗",                     "✓"),
    ("Priority support",         "✗",                    "✗",                     "✓"),
    ("Early access V2",          "✗",                    "✗",                     "✓"),
]
r = write_table(ws, r, pricing_headers, pricing_rows, [35, 30, 30, 25])

r += 1
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=4)
ws.cell(row=r, column=1,
        value="Free trial: 3 Insight scans + 2 File Uploads + 7 ngày Watch Mode — usage-limited "
              "để user experience value trước khi có time pressure.")
ws.cell(row=r, column=1).font = Font(bold=True)
ws.cell(row=r, column=1).alignment = Alignment(wrap_text=True)
ws.row_dimensions[r].height = 35


# ── 11. ROADMAP ───────────────────────────────────────────────────────────────
ws = wb.create_sheet("11 · Roadmap")
r = sheet_title(ws, "Product Roadmap")

roadmap_headers = ["Phase", "Version", "Timeline", "Focus Area", "Key Deliverables"]
roadmap_rows = [
    ("V1 — MVP", "V1 Social Intelligence Foundation", "Q2 2026 (8 tuần)",
     "Tuần 1–2: Infrastructure",
     "PostgreSQL schema, Supabase setup, Apify actor testing (5 platforms), n8n deployment, email listener setup"),
    ("V1 — MVP", "V1 Social Intelligence Foundation", "Q2 2026 (8 tuần)",
     "Tuần 3–4: Insight Mode Social",
     "Business context agent, scraping pipeline, W-N-P classification, report generation"),
    ("V1 — MVP", "V1 Social Intelligence Foundation", "Q2 2026 (8 tuần)",
     "Tuần 4–5: Insight Mode File Upload",
     "Email listener, Excel/CSV parser, sentiment + clustering pipeline, alert logic"),
    ("V1 — MVP", "V1 Social Intelligence Foundation", "Q2 2026 (8 tuần)",
     "Tuần 5–6: Watch Mode",
     "Monitor config, spike detection, Telegram alert (Option B), daily briefing cron"),
    ("V1 — MVP", "V1 Social Intelligence Foundation", "Q2 2026 (8 tuần)",
     "Tuần 6: Cross-mode + Dashboard",
     "'Deep Dive' cross-mode flow + Usage dashboard"),
    ("V1 — MVP", "V1 Social Intelligence Foundation", "Q2 2026 (8 tuần)",
     "Tuần 7: Monetization",
     "PDF export, Stripe integration, auth flow"),
    ("V1 — MVP", "V1 Social Intelligence Foundation", "Q2 2026 (8 tuần)",
     "Tuần 8: Launch",
     "5 usability test sessions → iterate → public launch"),
    ("V2 — Ext", "Intelligence Expansion", "Q3 2026",
     "Growth features",
     "Competitor monitoring, comparative report, multi-user workspace, weekly Watch report, Slack delivery, "
     "custom alert rules, Insight follow-up Q&A, Google Reviews scraping, interview transcript analysis"),
    ("V3 — Scale", "Enterprise & Scale", "Q4 2026",
     "Scale features",
     "Niche Finder gap scoring, API access tier, custom report branding, trend forecasting, "
     "competitor intelligence dashboard, Twitter/X scraping"),
]
r = write_table(ws, r, roadmap_headers, roadmap_rows, [14, 35, 22, 32, 65])
for row in ws.iter_rows(min_row=3, max_row=ws.max_row):
    ws.row_dimensions[row[0].row].height = 45


# ── 12. RISKS ─────────────────────────────────────────────────────────────────
ws = wb.create_sheet("12 · Risks")
r = sheet_title(ws, "Risks & Mitigations")

risk_headers = ["Level", "Risk", "Mitigation"]
risk_rows = [
    ("HIGH", "Scraping bị block / Platform ToS. Facebook, TikTok, Threads có thể break Apify actors bất kỳ lúc nào.",
     "Chỉ scrape public content. Graceful degradation: job tiếp tục với platform còn lại, flag missing source. Monitor actor success rate >95%."),
    ("HIGH", "Sentiment accuracy thấp cho tiếng Việt slang. Accuracy <75% khiến user không trust output.",
     "Test set 50 post với đánh giá thủ công trước khi launch. Fine-tune prompt theo từng content type. Show confidence indicator."),
    ("MED", "n8n failure = Watch Mode outage. n8n là single point of failure cho toàn bộ Watch Mode.",
     "Uptime Robot monitor n8n health. Alert PO ngay khi workflow fail. Runbook restart trong <15 phút. Consider n8n Cloud cho V2."),
    ("MED", "Apify cost overrun khi scale. Watch Mode chạy 24/7 per monitor.",
     "Hard cap usage per plan tier. 2h post cache. Monitor cost per user hàng tuần. Gate Watch Mode từ Growth tier."),
    ("MED", "False positive alert fatigue. Threshold quá thấp → user nhận quá nhiều alert không relevant.",
     "Default threshold 3x (medium). User tự chỉnh sensitivity. Track alert open rate — nếu <30%, proactively suggest threshold increase."),
    ("MED", "Data privacy — uploaded files. Excel feedback có thể chứa PII. Vi phạm PDPA.",
     "Không lưu raw file sau khi parse. Chỉ store derived insights. Document trong ToS. Hiển thị warning khi upload."),
    ("LOW", "Telegram không phổ biến với enterprise users. Một số brand manager không dùng Telegram cá nhân.",
     "Telegram-only trong V1. Email fallback trong 'Should Have'. Slack trong V2."),
    ("LOW", "Email listener reliability. IMAP polling có thể miss emails nếu server chậm hoặc filter spam.",
     "Polling interval 5 phút. Retry logic 3 lần. Confirm email trong web UI. Fallback: manual upload URL."),
]

level_colours = {"HIGH": "FF0000", "MED": "FFC000", "LOW": "70AD47"}
ws.cell(row=r, column=1, value="Level").font = Font(bold=True)
ws.cell(row=r, column=2, value="Risk").font = Font(bold=True)
ws.cell(row=r, column=3, value="Mitigation").font = Font(bold=True)
style_header_row(ws, r, 3, C_LIGHT, C_DARK)
r += 1

for i, (level, risk, mit) in enumerate(risk_rows):
    ws.cell(row=r, column=1, value=level)
    ws.cell(row=r, column=2, value=risk)
    ws.cell(row=r, column=3, value=mit)
    colour = level_colours.get(level, C_WHITE)
    ws.cell(row=r, column=1).fill = PatternFill("solid", fgColor=colour)
    ws.cell(row=r, column=1).font = Font(bold=True, color=C_WHITE)
    style_data_row(ws, r, 3, alt=(i % 2 == 1))
    ws.cell(row=r, column=1).fill = PatternFill("solid", fgColor=colour)
    ws.cell(row=r, column=1).font = Font(bold=True, color=C_WHITE)
    ws.row_dimensions[r].height = 55
    r += 1

ws.column_dimensions["A"].width = 10
ws.column_dimensions["B"].width = 52
ws.column_dimensions["C"].width = 62


# ── 13. OPEN QUESTIONS ────────────────────────────────────────────────────────
ws = wb.create_sheet("13 · Open Questions")
r = sheet_title(ws, "Open Questions")

oq_headers = ["#", "Importance", "Câu hỏi", "Impact nếu sai", "Cần trả lời trước", "Status / Proposed"]
oq_rows = [
    ("1", "HIGH",
     "Apify actors cho Facebook, TikTok, Threads, Reddit có production-stable cho content tiếng Việt không? Rate limit và ToS từng platform ra sao?",
     "Toàn bộ data pipeline phải redesign",
     "Sprint 1 bắt đầu", "Open"),
    ("2", "HIGH",
     "Watch Mode scrape frequency tối ưu là bao nhiêu? 30 phút cho latency tốt hơn nhưng đôi Apify cost. 60 phút rẻ hơn nhưng có thể miss short-lived spikes.",
     "Ảnh hưởng alert latency SLA và cost model",
     "Architecture finalized", "Open"),
    ("3", "MED",
     "Watch Mode có nên available trên Starter tier không? Cost per Watch Mode user ~$20/tháng — Starter $25 → negative margin.",
     "Pricing model và user acquisition funnel",
     "Pricing decision locked", "Proposed: Gate to Growth"),
    ("4", "MED",
     "Claude Haiku có đủ accuracy cho sentiment tiếng Việt với slang/codeswitching không?",
     "Nếu không đủ, Watch Mode cost tăng 3–4x",
     "Sprint 2 kết thúc", "Open"),
    ("5", "MED",
     "Free trial nên time-limited (14 ngày) hay usage-limited (3 Insight scans + 7 ngày Watch + 2 File Uploads)?",
     "Ảnh hưởng activation rate và trial-to-paid conversion",
     "V1 launch", "Proposed: Usage-limited"),
    ("6", "MED",
     "n8n: self-hosted trên Railway (~$10/tháng) hay n8n Cloud (~$20–50/tháng)? Budget <$50/tháng infra.",
     "Ảnh hưởng operational overhead cho 1-person team",
     "Sprint 1 bắt đầu", "Open"),
    ("7", "MED",
     "Alert delivery cho File Upload flow: Telegram hay Slack? Internal users (PM/Designer) thường dùng Slack hơn Telegram.",
     "Ảnh hưởng adoption của internal use case",
     "V1 launch", "Open"),
    ("8", "MED",
     "Email listener: monitor 1 email address chuyên dụng hay user kết nối email cá nhân qua OAuth?",
     "Ảnh hưởng security model và onboarding complexity",
     "Sprint 1", "Proposed: Dedicated email address per user"),
    ("9", "LOW",
     "Sharing trong V1: nếu PM và Designer cùng muốn xem report, cơ chế share là gì? PDF email, shared link, hay không support?",
     "Ảnh hưởng activation nếu user cần chia sẻ",
     "V1 launch", "Proposed: PDF share only"),
    ("10", "LOW",
     "Data retention policy: raw scraped posts có nên giữ 90 ngày như derived insights không, hay shorter TTL?",
     "Storage cost + legal risk",
     "V1 launch (PDPA consideration)", "Open"),
    ("11", "LOW",
     "File Upload: có nên giới hạn file size không? Và số cột tối thiểu cần có trong Excel để system parse được?",
     "Ảnh hưởng parser reliability",
     "Sprint 4", "Open"),
]
r = write_table(ws, r, oq_headers, oq_rows, [5, 10, 55, 38, 28, 28])

imp_colours = {"HIGH": "FF0000", "MED": "FFC000", "LOW": "70AD47"}
for row_idx in range(r - len(oq_rows), r):
    level_cell = ws.cell(row=row_idx, column=2)
    colour = imp_colours.get(level_cell.value, C_WHITE)
    if colour != C_WHITE:
        level_cell.fill = PatternFill("solid", fgColor=colour)
        level_cell.font = Font(bold=True, color=C_WHITE)

for row in ws.iter_rows(min_row=3, max_row=ws.max_row):
    ws.row_dimensions[row[0].row].height = 60


# ── 14. GTM ───────────────────────────────────────────────────────────────────
ws = wb.create_sheet("14 · Go-to-Market")
r = sheet_title(ws, "Go-to-Market & First 10 Users")

r = section_title(ws, r, "Target Early Adopters", 4)
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=4)
ws.cell(row=r, column=1,
        value="Product Owner và Marketing Manager tại Vietnamese SaaS startups Series A–B, "
              "đang dùng manual research và có budget $30–100/tháng cho tools.")
ws.cell(row=r, column=1).alignment = Alignment(wrap_text=True)
ws.row_dimensions[r].height = 35
r += 2

gtm_headers = ["Channel", "Tactic", "Goal"]
gtm_rows = [
    ("Founder Network",
     "Direct outreach tới 20 founders/PM quen biết. Demo cá nhân, không pitch deck.",
     "5 beta users từ warm network"),
    ("Facebook Groups",
     "Post case study 'tôi dùng AI để research social listening trong 5 phút' trong Product VN, Startup VN, Marketing VN",
     "Inbound leads từ exact ICP"),
    ("LinkedIn",
     "Weekly build-in-public post: screen recording workflow, số liệu thực (time saved, insights found)",
     "Credibility + SEO dài hạn"),
    ("Referral",
     "Beta users được invite 2 người — cả hai nhận thêm 5 Insight scans miễn phí",
     "Viral loop trong ICP community"),
]
r = write_table(ws, r, gtm_headers, gtm_rows, [22, 60, 40])

r += 1
r = section_title(ws, r, "Activation Hook", 4)
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=4)
ws.cell(row=r, column=1,
        value="First-time user chạy 1 Insight scan miễn phí — không cần credit card — và nhận PDF report trong 5 phút.\n"
              "\"Aha moment\" = khi user thấy PDF có brand name của họ, với evidence quotes thực từ social.")
ws.cell(row=r, column=1).alignment = Alignment(wrap_text=True)
ws.row_dimensions[r].height = 50
r += 2

r = section_title(ws, r, "First 10 Users Plan", 4)
first10 = [
    ("Users 1–3", "Founders/PMs trong network", "Dùng thử, lấy feedback thật"),
    ("Users 4–6", "Referral từ 3 users đầu", "Viral loop"),
    ("Users 7–10", "Inbound từ Facebook Group posts hoặc LinkedIn", "Organic acquisition"),
]
r = write_table(ws, r, ["Cohort", "Source", "Goal"], first10, [16, 38, 30])


# ── 15. LAUNCH CRITERIA ───────────────────────────────────────────────────────
ws = wb.create_sheet("15 · Launch Criteria")
r = sheet_title(ws, "Launch Criteria — Definition of Done")

criteria_headers = ["Category", "Criterion", "Pass / Status"]
criteria = [
    ("Functional (P0)", "Insight Mode Social: end-to-end flow hoàn thành < 5 phút với 0 P0 bugs", ""),
    ("Functional (P0)", "Insight Mode File Upload: xử lý 300–400 rows Excel trong < 2 giờ", ""),
    ("Functional (P0)", "Watch Mode: Telegram alert delivered trong < 30 phút sau spike detection", ""),
    ("Functional (P0)", "Daily briefing chạy ổn định ≥ 5 ngày liên tiếp không cần can thiệp thủ công", ""),
    ("Functional (P0)", "'Deep Dive' cross-mode flow hoạt động end-to-end", ""),
    ("Functional (P0)", "Stripe Checkout: payment flow thành công với test card", ""),
    ("Quality Gates", "Sentiment accuracy ≥ 75% trên test set 50 posts tiếng Việt", ""),
    ("Quality Gates", "SUS score ≥ 75/100 sau 5 usability test sessions", ""),
    ("Quality Gates", "PDF export readable trên desktop + mobile", ""),
    ("Reliability", "Apify actor success rate ≥ 95% trên 20 test runs", ""),
    ("Reliability", "n8n Watch Mode uptime ≥ 99% trong 7 ngày staging", ""),
    ("Reliability", "0 unhandled errors gây data loss trong user session", ""),
    ("Compliance", "Raw uploaded files không được lưu sau khi parse xong (verified by DB audit)", ""),
    ("Compliance", "Privacy warning hiển thị rõ trước khi user upload file", ""),
]
r = write_table(ws, r, criteria_headers, criteria, [20, 65, 18])

r += 2
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=3)
note = ws.cell(row=r, column=1,
               value="⚠️  Nếu bất kỳ tiêu chí P0 nào chưa đạt → delay launch, không ship workaround.")
note.font = Font(bold=True, color="FF0000", size=12)
note.alignment = Alignment(horizontal="center")
ws.row_dimensions[r].height = 25


# ── Save ──────────────────────────────────────────────────────────────────────
output_path = r"D:\learning\PO\SocialMind_PRD_v2.1.xlsx"
wb.save(output_path)
print(f"✅  Saved: {output_path}")
print(f"    Sheets: {[ws.title for ws in wb.worksheets]}")